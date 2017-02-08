import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
  render() {
    console.log("Rendering <MessageList/>");
    let mappedMessages = this.props.messages.map(function(message) {
      return <Message message={message}/>;
    });

    return <div id="message-list">
            {mappedMessages}
            <div className="message system">
              Anonymous1 changed their name to nomnom.
            </div>
          </div>
  }
}
export default MessageList;