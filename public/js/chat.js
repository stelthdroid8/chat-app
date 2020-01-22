const socket = io();
//DOM ELEMENTS
const $messageForm = document.getElementById('message-form');
const $messageFormInput = $messageForm.querySelector('#message-input');
const $messageFormButton = $messageForm.querySelector('button');
const $shareLocationButton = document.querySelector('#share-location');
const $messages = document.querySelector('#messages');

//TEMPLATES -- MUSTACHE

const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector(
  '#location-message-template'
).innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//OPTIONS
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const autoscroll = () => {
  //get new message element
  const $newMessage = $messages.lastElementChild;

  //find height of new message
  const newMessagesStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessagesStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
  // visible height
  const visibleHeight = $messages.offsetHeight;
  //height of messages container

  const containerHeight = $messages.scrollHeight;

  //where we are currently scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

//EVENT LISTENERS
socket.on('message', message => {
  // console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm A')
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

//watch and displaylocation message when it is sent

socket.on('locationMessage', message => {
  const html = Mustache.render(locationMessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format('h:mm A')
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });
  document.querySelector('#sidebar').innerHTML = html;
});
//watch for submit message button being used

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
  });
});

//watch for location button being clicked to emit proper event

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
      }
    );
  });
});

socket.emit('join', { username, room }, error => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});
