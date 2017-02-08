import React, {Component} from 'react';

class ChatBar extends Component {
constructor(props) {
  super(props);
  this.state = {value: ''};

  // this.handleChange = this.handleChange.bind(this);
  // this.handleSubmit = this.handleSubmit.bind(this);
}

  render() {
    console.log("Rendering <ChatBar/>");
    return (
      <footer>
        <input id="username" type="text" placeholder="Your Name (Optional)" value={this.props.username} readOnly />
        <input id="new-message" type="text" placeholder="Type a message and hit ENTER" onKeyPress={this.props._handlePressEnter} />
      </footer>
    );
  }
}
export default ChatBar;
