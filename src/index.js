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

// const rooms = {roomName: {users: {}}, roomName2: {users: {}}};
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
  console.log(rooms);
  res.redirect(req.body.room);

  // send msg that new room is created
  io.emit('room created', req.body.room);
});


app.get('/:room', (req, res) => {
  // redirect if the room does not exist
  if (rooms[req.params.room] === null) {
    return res.redirect('/');
  }
  res.render('room', { roomName: req.params.room })
});


io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('new user', (room, userName) => {
    // join user to room
    socket.join(room);
    // add user to room
    rooms[room].users[socket.id] = userName;
    console.log(rooms);

    socket.broadcast.to(room).emit('user connected', userName);
  });

  socket.on('chat message', (room, message, userName) => {
    io.to(room).emit('chat message', {message: message, userName: rooms[room].users[socket.id]}); // send data to all
  });

  socket.on('disconnect', () => {
    // find the user's room to delete
    const userRooms = getUserRooms(socket.id);
    for (const room of userRooms){
      console.log('user disconnected');
      socket.broadcast.to(room).emit('user disconnected', rooms[room].users[socket.id]);
      delete rooms[room].users[socket.id];
      console.log(rooms[room].users);
    };
  });
});

// const rooms = {roomName: {users: {}}, roomName2: {users: {}}};
const getUserRooms = (socketId) => {
  const userRooms = [];
  for (const [roomName, usersObj] of Object.entries(rooms)) {
    // console.log(`${roomName} ${usersObj}`);
    if (socketId in usersObj.users) {
      userRooms.push(roomName);
    };
  }
  console.log('user rooms', userRooms);
  return userRooms;
};

server.listen(3000, () => {
  console.log('listening on *:3000');
});