import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
import Nav from './Nav.jsx';

const initialState = {
  currentUser: {name: 'Anonymous'}, // optional. if currentUser is not defined, it means the user is Anonymous
  messages: [],
  userCount: 0,
  color: 'black'
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.ws = undefined;
  }

  // handle all messages coming from the server
  onMessageReceive = (message) => {
    let parsedMessage = JSON.parse(message.data);
    switch(parsedMessage.type) {
      case 'initialMessages':
        this.setState({messages: parsedMessage.messages});
        break;
      case 'incomingMessage':
        this.setState({messages: parsedMessage.messages});
        break;
      case 'incomingNotification':
        console.log('message back in client----> ', parsedMessage);
        let oldName = parsedMessage.messages[parsedMessage.messages.length - 1].oldName
        let newName = parsedMessage.messages[parsedMessage.messages.length - 1].newName
        this.setState({currentUser: {...this.state.currentUser, oldName: oldName},
                       messages: parsedMessage.messages});
        break;
      case 'userCount':
        this.setState({userCount: parsedMessage.number})
        break;
      case 'userConnection':
        this.setState({messages: parsedMessage.messages});
        break;
      case 'initialColor':
        this.setState({color: parsedMessage.color});
        break;
      default:
        throw new Error("Unknown event type " + parsedMessage.type);
    }
  }

  // stringifies a message before sending it to the server
  onMessageSend = (message) => {
    this.ws.send(JSON.stringify(message))
  }

  // handles sending info to server to update username
  onNameSubmit = (name) => {
    console.log('name: ', name);
    let nameToServer = {type: 'postNotification',
                        oldName: this.state.currentUser.name,
                        newName: name};
    this.onMessageSend(nameToServer);
    this.setState({currentUser: {name: name}});
  }

  // handles sending info to server to send a message
  onMessageSubmit = (content) => {
    let messageToServer = {type: 'postMessage',
                           name: this.state.currentUser.name,
                           content: content,
                           color: this.state.color};
    console.log('messageToServer: ', messageToServer);
    this.onMessageSend(messageToServer);
    // reset the message input form
    document.getElementById("new-message").value = "";
  }

  componentDidMount() {
    console.log("componentDidMount <App />");

    // connect to websocket server
    this.ws = new WebSocket('ws://localhost:4000');
    this.ws.addEventListener('open', () => {
      console.log('Connected to server');
    })
    this.ws.addEventListener('message', this.onMessageReceive);
  }

  render() {
    return (
      <div className='wrapper'>
        <Nav count={this.state.userCount}/>
        <MessageList state={this.state}/>
        <ChatBar state={this.state} onMessageSubmit={this.onMessageSubmit} onNameSubmit={this.onNameSubmit} />
      </div>
    );
  }
}
export default App;