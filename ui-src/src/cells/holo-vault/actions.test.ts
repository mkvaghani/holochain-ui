import configureMockStore, { MockStoreEnhanced } from 'redux-mock-store'
import axios from 'axios'
import { AnyAction } from 'redux'
// @ts-ignore
import axiosMiddleware from 'redux-axios-middleware'
import MockAdapter from 'axios-mock-adapter'
import * as vaultActions from './actions'
// import {initialState} from './reducer'

const mockHolochainClient = axios.create({
  baseURL: '/fn/holochain/callBridgedFunction',
  	responseType: 'json',
  	method: 'POST'
})

const mockStore = configureMockStore([axiosMiddleware(mockHolochainClient)])
let store: MockStoreEnhanced
let mock: MockAdapter

beforeEach(() => {
  store = mockStore({})
  mock = new MockAdapter(mockHolochainClient)
})

afterEach(() => {
  mock.reset()
})

function genExpectedAction (zome: string, fname: string, data: any): any {
  return {
    type: `holo-vault/${zome}/${fname}`,
    payload: {
      request: {
        data: {
          happ: 'holo-vault',
          zome: zome,
          capability: 'main',
          func: fname,
          data: data
        }
      }
    }
  }
}

const asyncActionTestTable: Array<[string, string, (input: any) => AnyAction, any, any]> = [
  [
    'personas',
    'create_persona',
    vaultActions.CreatePersona.create,
		{ name: 'test persona', id: 'test_persona' },
    'xxx'
  ],
  [
    'personas',
    'get_personas',
    vaultActions.GetPersonas.create,
    null,
		[{ name: 'test persona', id: 'test_persona' }, { name: 'test persona', id: 'test_persona' }]
  ],
  [
    'personas',
    'add_field',
    vaultActions.AddField.create,
		{ personaHash: 'xxx', field: { name: 'fieldName', data: 'data' } },
    true
  ],
  [
    'personas',
    'delete_field',
    vaultActions.DeleteField.create,
		{ personaHash: 'xxx', fieldName: 'fieldName' },
    1
  ],
  [
    'profiles',
    'get_profiles',
    vaultActions.GetProfiles.create,
    {},
    [{ name: 'profile1' }, { name: 'profile2' }]
  ],
  [
    'profiles',
    'create_mapping',
    vaultActions.CreateMapping.create,
    {
      retrieverDNA: 'XYZ',
      profileFieldName: 'handle',
      personaHash: 'QmbzbwpLA8HjZCFqkPQE2TAEnugUPYz14W9Ux1hh8882Nr', // implies field is already mapped
      personaFieldName: 'nickName'
    },
    1
  ]
]

asyncActionTestTable.forEach(([zome, name, actionCreator, testInput, testResponse]) => {

  describe(`${name} action`, () => {

    const expectedAction = genExpectedAction(zome, name, testInput)

    it('should create an action that is correctly structured given parameters', () => {
      expect(actionCreator(testInput)).toEqual(expectedAction)
    })

    it('should trigger middleware creating a request response that returns a promise with the response', () => {
      mock.onPost('/').reply(200, testResponse)

  		    // @ts-ignore - minor error in the typings for redux/typesafe-actions
  		return store.dispatch(actionCreator(testInput)).then((response) => {
    const actions = store.getActions()
    expect(actions[0]).toEqual(expectedAction)
    expect(response.payload.data).toEqual(testResponse)
  		})
    })
  })

})
