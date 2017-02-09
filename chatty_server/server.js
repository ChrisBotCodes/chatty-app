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

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.send(JSON.stringify(messages))

  // receive message from client
  ws.on('message', (message) => {
    console.log(message);
    let parsedMessage = JSON.parse(message);
    let messageToClients = {uuid: uuid.v4(),
                           name: parsedMessage.name,
                           content: parsedMessage.content};
    messages = [...messages, messageToClients];
    console.log(`User ${parsedMessage.name} said ${parsedMessage.content}`);
    console.log(messageToClients);
    wss.broadcast(messages);
  })

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});