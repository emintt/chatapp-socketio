'use strict';


const socket = io();

  const messages = document.querySelector('#messages');
  const form = document.querySelector('#form');
  const chatMesInput = document.querySelector('#input');

  const appendMessage = (msg, className) => {
    console.log('msg', msg);
    console.log('classname', className);
    const item = document.createElement('li');
    item.textContent = msg;
    if (className) {
      item.classList.add(className);
    }
    console.log('item', item);
    messages.appendChild(item);
  };

  const userName = prompt(`What's your name?`);
  socket.emit('new user', userName);

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const message = chatMesInput.value;
    if (message) {
      socket.emit('chat message', {message, userName}); // send mes, name to server with a 'chat message' event
      chatMesInput.value = '';
    }
  });

  socket.on('chat message', function(msg) {
    appendMessage(`${msg.userName}: ${msg.message}`);
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on('user connected', (name) => {
    appendMessage(`${name} joined`, 'bold');
  });

  socket.on('user disconnected', (name) => {
    appendMessage(`${name} left`, 'bold-italic');
  });