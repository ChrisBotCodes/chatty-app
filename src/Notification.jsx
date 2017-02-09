import React, {Component} from 'react';

class Notification extends Component {
  render() {
    console.log("Rendering <Notification/>");
    return (
      <div className="message system">
        {this.props.message.oldName} changed their name to {this.props.message.newName}.
      </div>
    );
  }
}
export default Notification;