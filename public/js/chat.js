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
