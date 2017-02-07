import React, {Component} from 'react';

class MessageList extends Component {
  render() {
    console.log("Rendering <MessageList/>");
    return (
      <div>
        <div id="message-list">
        {this.props.messages.map(function(message) {
          return (<div className="message" key={message.id}>
                    <span className="username">{message.username}</span>
                    <span className="content">{message.content}</span>
                  </div>);
        })}
          <div className="message system">
            Anonymous1 changed their name to nomnom.
          </div>
        </div>
      </div>
    );
  }
}
export default MessageList;