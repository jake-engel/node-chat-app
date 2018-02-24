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

socket.on('newLocationMessage', function(message) {
  const messages = document.getElementById('messages');
  const newMessage = document.createElement("li");
  newMessage.innerHTML = `${message.from}: <a href="${message.url}" target="_blank"> Current Location</a>`;
  messages.appendChild(newMessage);
});

const userText = document.querySelector('#message-form input');
const submit = document.querySelector('button');

submit.addEventListener('click', function(event) {
  event.preventDefault();

  if (user.Textvalue) {
    socket.emit('createMessage', {
      from: 'User',
      text: userText.value
    }, function() {

    });
  }
});

const locationButton = document.getElementById('send-location');

locationButton.addEventListener('click', function() {
  if (!"geolocation" in navigator) {
    return alert('Geolocation not supported by your browser.');
  }
  navigator.geolocation.getCurrentPosition(function(position) {
    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
  }, function() {
    alert('Unable to fetch location.');
  });
});



