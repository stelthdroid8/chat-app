const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicDirectoryPath));

io.on('connection', socket => {
  socket.broadcast.emit('message', 'New user joined!');
  socket.on('send-message', message => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    io.emit('message', 'User has left');
  });
});

server.listen(port, () => {
  console.log(`up and running on : ${port}`);
});
