import { connect } from 'react-redux'
import NewChannel from '../components/channels/newChannel'
import { Dispatch } from 'redux'
import {
	GetAllMembers,
	CreateCustomChannel
} from '../actions'
import { ChannelSpec } from '../types/model/channel'

const mapStateToProps = (state: any) => {
  return {
    users: state.holoChat.users
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getAllMembers: () => dispatch(GetAllMembers.create(undefined)),
    createChannel: (channelSpec: ChannelSpec) => dispatch(CreateCustomChannel.create(channelSpec))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewChannel)
