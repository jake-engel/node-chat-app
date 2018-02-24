const socket = io();

socket.on('connect', function() {
  console.log('Connected to server!');
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
  const messages = document.getElementById('messages');
  const newMessage = document.createElement("li");
  newMessage.appendChild(document.createTextNode(`${message.from}: ${message.text}`));
  messages.appendChild(newMessage);
});

const userText = document.querySelector('#message-form input');
const submit = document.querySelector('button');

submit.addEventListener('click', (event) => {
  event.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: userText.value
  }, function() {

  });
});
