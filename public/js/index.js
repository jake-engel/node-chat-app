const socket = io();

function scrollToBottom() {
  // Selectors
  const messages = document.getElementById('messages');
  const newMessage = messages.lastElementChild;
  const previousNewMessage = newMessage.previousElementSibling;

  // Heights
  const clientHeight = messages.clientHeight;
  const scrollTop = messages.scrollTop;
  const scrollHeight = messages.scrollHeight;
  const newMessageStyle = window.getComputedStyle(newMessage, null);
  const newMessageHeight = parseInt(newMessageStyle.getPropertyValue('height'));
  let previousNewMessageHeight = 0;
  if (previousNewMessage) {
    const previousNewMessageStyle = window.getComputedStyle(previousNewMessage, null);
    previousNewMessageHeight = parseInt(previousNewMessageStyle.getPropertyValue("height"));
  }

  if (clientHeight + scrollTop + newMessageHeight + previousNewMessageHeight >= scrollHeight) {
    messages.scrollTop = scrollHeight;
  }
}

socket.on('connect', function() {
  console.log('Connected to server!');
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
  const template = document.getElementById('message-template').innerHTML;
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  document.getElementById('messages').innerHTML += html;
  scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
  const template = document.getElementById('location-message-template').innerHTML;
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url
  });

  document.getElementById('messages').innerHTML += html;
  // scrollToBottom();
});

const userText = document.querySelector('#message-form input');
const submit = document.querySelector('button');

submit.addEventListener('click', function(event) {
  event.preventDefault();

  if (userText.value.trim()) {
    socket.emit('createMessage', {
      from: 'User',
      text: userText.value
    }
    , function() {
      userText.value = "";
    });
  };
});

const locationButton = document.getElementById('send-location');

locationButton.addEventListener('click', function() {
  if (!"geolocation" in navigator) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.innerHTML = 'Sending Location...';
  locationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.innerHTML = 'Send Location';
    locationButton.removeAttribute('disabled');
    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
  }, function() {
    locationButton.innerHTML = 'Send Location';
    locationButton.removeAttribute('disabled');
    alert('Unable to fetch location.');
  });
});



