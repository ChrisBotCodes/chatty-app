// server.js

const express = require('express');
const SocketServer = require('ws');
const uuid = require('node-uuid');

// Set the port to 4000
const PORT = 4000;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer.Server({ server });

messages = [];
userConnected = {type: 'userConnection', content: 'A new user has connected to the chat.'};
userDisconnected = {type: 'userConnection', content: 'A user has disconnected from the chat.'};

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

// broadcast message to all clients
wss.broadcast = (messageToBroadcast) => {
  wss.clients.forEach(function each(client) {
    if (client.readyState === SocketServer.OPEN) {
      client.send(JSON.stringify(messageToBroadcast));
    }
  })
}

onlineUsers = () => {
  let onlineUsers = {type: 'userCount',
                    uuid: uuid.v4(),
                     number: wss.clients.size};
  wss.broadcast(onlineUsers);
}

wss.on('connection', (ws) => {
  console.log('Client connected');
  onlineUsers();
  console.log('online users connected: ', wss.clients.size);
  messages = [...messages, userConnected];
  let newUserConnected = {type: 'userConnection', messages: messages};
  wss.broadcast(newUserConnected);
  let initialMessages = {type: 'initialMessages', messages: messages }
  ws.send(JSON.stringify(initialMessages))

  // receive message from client
  ws.on('message', (message) => {
    let parsedMessage = JSON.parse(message);
    switch(parsedMessage.type) {
      case 'postMessage':
        let messageToClients = {type: 'incomingMessage',
                                uuid: uuid.v4(),
                                name: parsedMessage.name,
                                content: parsedMessage.content};
        messages = [...messages, messageToClients];
        let newMessage = {type: 'incomingMessage', messages: messages};
        wss.broadcast(newMessage);
        break;
      case 'postNotification':
        let notificationToClients = {type: 'incomingNotification',
                                     uuid: uuid.v4(),
                                     oldName: parsedMessage.oldName,
                                     newName: parsedMessage.newName};
        messages = [...messages, notificationToClients];
        let newNotification = {type: 'incomingNotification', messages: messages};
        wss.broadcast(newNotification);
        break;
      default:
        throw new Error("Unknown event type " + parsedMessage.type);
    }
  })

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    onlineUsers();
    console.log('online users connected: ', wss.clients.size);
    messages = [...messages, userDisconnected];
    let newUserDisconnected = {type: 'userConnection', messages: messages};
    wss.broadcast(newUserDisconnected);
  })
});