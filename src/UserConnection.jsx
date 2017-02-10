import React, {Component} from 'react';

class UserConnection extends Component {
  render() {
    console.log("Rendering <UserConnection/>");
    return (
      <div className="message system" key={this.props.message.uuid}>
        {this.props.message.content}
      </div>
    );
  }
}
export default UserConnection;