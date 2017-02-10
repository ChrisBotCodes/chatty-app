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

// message list starts empty
messages = [];

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

// handles the number of users online
onlineUsers = () => {
  let onlineUsers = {type: 'userCount',
                     uuid: uuid.v4(),
                     number: wss.clients.size};
  wss.broadcast(onlineUsers);
}

// handles when a user connects
userConnected = () => {
  let userConnected = {type: 'userConnection',
                      uuid: uuid.v4(),
                      content: 'A new user has connected to the chat.'};
  return userConnected;
}

// handles when a user disconnects
userDisconnected = () => {
  let userDisconnected = {type: 'userConnection',
                          uuid: uuid.v4(),
                          content: 'A user has disconnected from the chat.'};
  return userDisconnected;
}

// chooses a random color to apply to a user's name
randomColor = () => {
  let colorPalette = ['#010777', '#a50000', '#186b00', '#f24fd9', '#ef8f00', '#009aa5', '#71a500'];
  return colorPalette[Math.floor(Math.random() * 6) + 1];

}

wss.on('connection', (ws) => {
  console.log('Client connected');

  // set random color to user
  let getInitialColor = {type: 'initialColor', color: randomColor()};
  ws.send(JSON.stringify(getInitialColor));

  // display that a user has connected to the chat
  onlineUsers();
  console.log('online users connected: ', wss.clients.size);

  // send a user connection notification
  messages = [...messages, userConnected()];
  let newUserConnected = {type: 'userConnection', messages: messages};
  wss.broadcast(newUserConnected);

  // send initial message list
  let initialMessages = {type: 'initialMessages', messages: messages }
  ws.send(JSON.stringify(initialMessages))

  // receive message or notification from client
  ws.on('message', (message) => {
    let parsedMessage = JSON.parse(message);
    switch(parsedMessage.type) {
      case 'postMessage':
        let messageToClients = {type: 'incomingMessage',
                                uuid: uuid.v4(),
                                name: parsedMessage.name,
                                content: parsedMessage.content,
                                color: parsedMessage.color};
        messages = [...messages, messageToClients];
        let newMessage = {type: 'incomingMessage', messages: messages};
        console.log('message to client----> ', newMessage);
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

    // display that a user has disconnected from the chat
    onlineUsers();
    console.log('online users connected: ', wss.clients.size);

    // send a user disconnection notification
    messages = [...messages, userDisconnected()];
    let newUserDisconnected = {type: 'userConnection', messages: messages};
    wss.broadcast(newUserDisconnected);
  })
});