const socket = io();

const $messageForm = document.getElementById('message-form');
const $messageFormInput = $messageForm.querySelector('#message-input');
const $messageFormButton = $messageForm.querySelector('button');
const $shareLocationButton = document.querySelector('#share-location');

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

socket.on('message', message => {
  console.log(message);
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
