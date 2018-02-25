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
  const urlParamString = window.location.search.substring(1);
  const urlParamObj = JSON.parse('{"' + decodeURI(urlParamString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"').replace("+", " ") + '"}');

  socket.emit('join', urlParamObj, function(err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
  const userList = document.getElementById('users');
  userList.innerHTML = '';
  userList.appendChild(document.createElement('ol'));
  const ol = document.querySelector('#users ol');

  users.forEach(function(user) {
    li = document.createElement("li");
    li.innerHTML = user;
    ol.appendChild(li);
  });
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
submit.setAttribute('disabled', 'disabled');

submit.addEventListener('click', function(event) {
  event.preventDefault();
  const urlParamString = window.location.search.substring(1);
  const urlParamObj = JSON.parse('{"' + decodeURI(urlParamString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"').replace("+", " ") + '"}');

  if (userText.value.trim()) {
    socket.emit('createMessage', {
      from: urlParamObj.name,
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

const inputMessageBar = document.querySelector('form input[name="message"]')

inputMessageBar.addEventListener('keydown', function(event) {
  const realInputVal = inputMessageBar.value.trim() + event.key.trim();
  submit.removeAttribute('disabled');
  if (realInputVal.length === 0 || realInputVal.endsWith('Backspace')) {
    submit.setAttribute('disabled', 'disabled');
  }
});


