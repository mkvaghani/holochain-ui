import * as React from 'react'
// import {Provider} from 'react-redux'
import { storiesOf } from "@storybook/react";
import { MemoryRouter } from 'react-router'
import { withNotes } from '@storybook/addon-notes'
import {configure} from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import channels from './channels.md'
import newChannel from './newChannel.md'
import filterAgents from './filterAgents.md'
import selectAgent from './selectAgent.md'
import newChat from './newChat.md'
// import CreateStore from '../../../../store'
// import  * as constants from '../../constants'
// import{Message as MessageType} from '../../types/message'
import Channels from './channels'
import NewChannel from './newChannel'

import {specs} from 'storybook-addon-specifications'
import { newChannelTests } from './newChannel.test'
import { filterAgentsTests } from './filterAgents.test'
import { selectAgentTests } from './selectAgent.test'
import { newChatTests } from './newChat.test'
import { channelsTests } from './channels.test'


configure({adapter: new Adapter()})
// let store = CreateStore()

function StartComponent () {
    return (
      <div>Starting point</div>
    )
}

storiesOf('HoloChat/Channels', module)
.addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  // .addDecorator(story => <Provider store={store}>{story()}</Provider>)
  .add('List my Channels', withNotes(channels) (() => {
    specs(() => channelsTests)
      return <Channels channelList={()=> {}} channels={[]} />
  }))
  .add('Start a new Channel', withNotes(newChannel) (() => {
    specs(() => newChannelTests)
      return <NewChannel />
  }))
  .add('Filter the list', withNotes(filterAgents) (() => {
    specs(() => filterAgentsTests)
      return <StartComponent />
  }))
  .add('Add people to the Channel', withNotes(selectAgent) (() => {
    specs(() => selectAgentTests)
      return <StartComponent />
  }))
  .add('A new chat starts', withNotes(newChat) (() => {
    specs(() => newChatTests)
    return <StartComponent />
  }))