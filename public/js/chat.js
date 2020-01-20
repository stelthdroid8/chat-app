const socket = io();

const messageForm = document.getElementById('message-form');

messageForm.addEventListener('submit', e => {
  e.preventDefault();

  const messageInput = document.querySelector('#message-input');
  const message = messageInput.value;

  socket.emit('send-message', message);
  messageInput.value = '';
});

socket.on('message', message => {
  console.log(message);
});

const locationButton = document.querySelector('#share-location');

locationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('geolocation not support by your browser');
  }

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit('sendLocation', {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude
    });
    // console.log(position);
  });
});
