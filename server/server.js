require('./config/config');

const http = require('http');
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '..', 'public');
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log("New user connected");

  socket.emit('newMessage', {
    from: 'Jake#1',
    text: 'Hey Jake it\'s Jake#1!',
    createdAt: '123456'
  });

  socket.on('createMessage', (message) => {
    console.log('newMessage: ', message);
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected!!');
  });
})

server.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
