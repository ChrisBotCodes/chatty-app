import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
  }

  // handles the event when sending a message
  onEnterMessage = (e) => {
    if (e.key === "Enter" && e.target.value !== '') {
      this.props.onMessageSubmit(e.target.value)
    }
  }

  // handles the event when updating username
  onEnterName = (e) => {
    if (e.key === "Enter") {
      if (this.props.state.currentUser.name === 'Anonymous') {
        if (e.target.value && e.target.value !== 'Anonymous') {
          this.props.onNameSubmit(e.target.value)
        }
      } else if (e.target.value !== this.props.state.currentUser.name) {
        if (e.target.value === '') {
          this.props.onNameSubmit('Anonymous');
        } else {
          this.props.onNameSubmit(e.target.value)
        }
      }
    }
  }

  render() {
    console.log("Rendering <ChatBar/>");
    return (
      <footer>
        <input id="username" type="text" placeholder="Your Name (Optional)" onKeyPress={this.onEnterName} />
        <input id="new-message" type="text" placeholder="Type a message and hit ENTER" onKeyPress={this.onEnterMessage} />
      </footer>
    );
  }
}

export default ChatBar;