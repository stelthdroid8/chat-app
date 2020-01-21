const socket = io();
//DOM ELEMENTS
const $messageForm = document.getElementById('message-form');
const $messageFormInput = $messageForm.querySelector('#message-input');
const $messageFormButton = $messageForm.querySelector('button');
const $shareLocationButton = document.querySelector('#share-location');
const $messages = document.querySelector('#messages');

//TEMPLATES -- MUSTACHE

const messageTemplate = document.querySelector('#message-template').innerHTML;

//EVENT LISTENERS
socket.on('message', message => {
  // console.log(message);
  const html = Mustache.render(messageTemplate, { message });
  $messages.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', e => {
  e.preventDefault();
  $messageFormButton.setAttribute('disabled', 'disabled');
  const message = $messageFormInput.value;

  socket.emit('sendMessage', message, error => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();
    if (error) {
      return console.log(error);
    }
    console.log('message was delivered');
  });
});

// const locationButton = document.querySelector('#share-location');

$shareLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('geolocation not support by your browser');
  }
  $shareLocationButton.setAttribute('disabled', 'disabled');
  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      'sendLocation',
      {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude
      },
      () => {
        $shareLocationButton.removeAttribute('disabled');
        console.log('location shared!');
      }
    );
    // console.log(position);
  });
});
