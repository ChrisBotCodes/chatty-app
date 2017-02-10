import React, {Component} from 'react';
import Message from './Message.jsx';
import Notification from './Notification.jsx';
import UserConnection from './UserConnection.jsx';

class MessageList extends Component {
  render() {
    console.log("Rendering <MessageList/>");

    return (<div id="message-list">
            {this.props.state.messages.map(message => {
              if (message.type === 'incomingMessage') {
                return <Message key={message.uuid} message={message} color={this.props.state.color}/>
              } else if (message.type === 'incomingNotification') {
                return <Notification key={message.uuid} message={message}/>
              } else {
                return <UserConnection key={message.uuid} message={message}/>
              }
            })}</div>
    )
  }
}
export default MessageList;