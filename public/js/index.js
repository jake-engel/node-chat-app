const socket = io();

socket.on('connect', function() {
  console.log('Connected to server!');

  socket.emit('createMessage', {
    from: 'jake2@jake.com',
    text: 'Hey Jake, it\'s Jake#2'
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
  console.log('newMessage: ', message);
})
