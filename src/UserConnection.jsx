import React, {Component} from 'react';

class UserConnection extends Component {
  render() {
    console.log("Rendering <UserConnection/>");
    return (
      <div className="message system">
        {this.props.message.content}
      </div>
    );
  }
}
export default UserConnection;