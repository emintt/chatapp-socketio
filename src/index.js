import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.set('view engine', 'pug');
app.set('views', 'src/views');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const __dirname = import.meta.dirname;

// const rooms = {name: {uers: {}}, name2: {}};
const rooms = {};


app.get('/', (req, res) => {
  const values = {
    rooms: rooms, 
  };
  res.render('index', values);
});

app.post('/room', (req, res) => {
  console.log(rooms[req.body.room]);
  // redirect if room already exists
  if (rooms[req.body.room]) {
    return res.redirect('/');
  }
  // add room to rooms variable
  rooms[req.body.room] = {users: {}};
  console.log(req.body.room);
  res.redirect(req.body.room);
  // send msg that new room is created
});


app.get('/:room', (req, res) => {
  res.render('room', { roomName: req.params.room })
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