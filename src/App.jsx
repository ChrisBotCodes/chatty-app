import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

const initialState = {
  currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
  messages: [
    {
      id: 1,
      username: "Bob",
      content: "Has anyone seen my marbles?"
    },
    {
      id: 2,
      username: "Anonymous",
      content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
    }
  ]
}

class App extends Component {
  constructor(props) {
    super(props);
    // set initial state to id/username/content data
    this.state = initialState;

    this.updateState = (newName) => {
      this.setState({currentUser: {name: newName}})
    }
  }

  componentDidMount() {
  console.log("componentDidMount <App />");
  setTimeout(() => {
    console.log("Simulating incoming message");
    // Add a new message to the list of messages in the data store
    const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
    const messages = this.state.messages.concat(newMessage)
    // Update the state of the app component.
    // Calling setState will trigger a call to render() in App and all child components.
    this.setState({messages: messages})
    }, 3000);
  }

  _handlePressEnter = (e) => {
    if (e.key === "Enter") {
      const newMessage = {id: this.state.messages.length+1, username: this.state.currentUser.name, content: e.target.value};
      const messages = this.state.messages.concat(newMessage)
      this.setState({messages: messages});
    }
    console.log(e.target.value);
    console.log(e.key);

  }

  render() {
    return (
      <div className='wrapper'>
        <nav>
          <h1>Chatty</h1>
        </nav>
        <MessageList messages={this.state.messages}/>
        <ChatBar username={this.state.currentUser.name} _handlePressEnter={this._handlePressEnter}/>
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