import React, {Component} from 'react';

class ChatBar extends Component {
constructor(props) {
  super(props);
  this.state = {value: ''};

  // this.handleChange = this.handleChange.bind(this);
  // this.handleSubmit = this.handleSubmit.bind(this);
}
onEnterMessage = (e) => {
  if (e.key === "Enter" && e.target.value !== '') {
    this.props.onMessageSubmit(e.target.value)
  }
}

onEnterName = (e) => {
  if (e.key === "Enter") {
    if (e.target.value) {
      this.props.onNameSubmit(e.target.value)
    } else {
      this.props.onNameSubmit('Anonymous');
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
