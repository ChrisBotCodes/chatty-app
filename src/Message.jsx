import React, {Component} from 'react';

const Message = ({message, color}) =>
  <div className="message" key={message.uuid}>
    <span className="username" style={{color: message.color}}>{message.name}</span>
    <span className="content">{message.content}</span>
  </div>

export default Message;