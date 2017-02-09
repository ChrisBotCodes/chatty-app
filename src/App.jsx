import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

const initialState = {
  currentUser: {name: 'Anonymous'}, // optional. if currentUser is not defined, it means the user is Anonymous
  messages: [],
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.ws = undefined;
  }

  onMessageReceive = (message) => {
    let parsedMessage = JSON.parse(message.data);
    console.log('parsed message----->', parsedMessage);
    switch(parsedMessage.type) {
      case 'initialMessages':
        this.setState({messages: parsedMessage.messages});
        break;
      case 'incomingMessage':
        this.setState({messages: parsedMessage.messages});
        break;
      case 'incomingNotification':
      let oldName = parsedMessage.messages[parsedMessage.messages.length - 1].oldName
      let newName = parsedMessage.messages[parsedMessage.messages.length - 1].newName
        this.setState({currentUser: {name: newName, oldName: oldName},
                       messages: parsedMessage.messages});
        break;
      default:
        throw new Error("Unknown event type " + parsedMessage.type);
    }
  }

  onMessageSend = (message) => {
    this.ws.send(JSON.stringify(message))
  }

  onNameSubmit = (name) => {
    console.log('name: ', name);
    let nameToServer = {type: 'postNotification',
                        oldName: this.state.currentUser.name,
                        newName: name};
    this.onMessageSend(nameToServer);
    // if (name === '') {
    //   this.setState({currentUser: {name: 'Anonymous'}});
    // } else {
    //   this.setState({currentUser: {name: name}});
    // }
  }

  onMessageSubmit = (content) => {
    let messageToServer = {type: 'postMessage',
                           name: this.state.currentUser.name,
                           content: content};
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
        <nav>
          <h1>Chatty</h1>
        </nav>
        <MessageList state={this.state}/>
        <ChatBar state={this.state} onMessageSubmit={this.onMessageSubmit} onNameSubmit={this.onNameSubmit} />
      </div>
    );
  }
}
export default App;




// //lecture notes:
// const wss = new WebSocket.Server({server: app}) // do this after you call app.listen
// wss.on('connection', (ws) => {
//   //wss is everybody, ws is the client you're current talking to
//   console.log('New Client Connected');
//   board = [0,0,0,-1,1,0,0,0,1]
//   let message = {type: 'setup', board: board}
//   ws.send({message})
//   ws.send("hi how are you doing?"); //message to client that just connected

//   ws.on('close', () => console.log('Client left.'))
// })

// in APP/client side
// let ws = new WebSocket('ws://localhost:3000');

// let initializeBoard = () => {
//   for
// }

// ws.addEventListener('open', (event) => {
//   console.log('Connected to WS Server.');
//   //good place to initialize everything because this should only happen once
// })


// ws.addEventListener('message', (message) => {
//   // same as ws.onmessage = (message) => {}
//   console.log(`Received ${message.data}`);
// })

// ws.addEventListener('error', (error) => {
//   console.log("Error: ", error);
// })