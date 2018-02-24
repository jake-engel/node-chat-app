require('./config/config');

const http = require('http');
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');

const app = express();
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '..', 'public');
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log("New user connected");

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined.'));

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage: ', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    console.log('createLocationMessage: ', coords);
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.lat, coords.lng));
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected!!');
  });
})

server.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
