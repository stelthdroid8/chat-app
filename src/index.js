const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicDirectoryPath));

io.on('connection', socket => {
  socket.broadcast.emit('message', 'New user joined!');
  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback('Profanity is not a llowed');
    }
    io.emit('message', message);
    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', 'User has left');
  });

  socket.on('sendLocation', ({ longitude, latitude }, callback) => {
    io.emit('message', `https://google.com/maps?q=${latitude},${longitude}`);
    callback();
  });
});

server.listen(port, () => {
  console.log(`up and running on : ${port}`);
});
