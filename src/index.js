import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';


const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = import.meta.dirname;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('new user', userName => {
    users[socket.id] = userName;
    socket.broadcast.emit('user connected', userName);
  });
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // send data to all
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
    socket.broadcast.emit('user disconnected', users[socket.id])
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});