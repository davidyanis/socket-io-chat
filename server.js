const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'/public/static/web/index.html'));
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.broadcast.emit('connected user');


  socket.on('disconnect', function(){
      console.log('user disconnected');
      socket.broadcast.emit('disconnected user');
  });

  socket.on('chat message', function(msg){
      console.log('message: ' +msg);
      io.emit('chat message', msg);
  });
});

http.listen(1337, function(){
  console.log('listening on *:1337');
});