const express = require('express');
const axios = require('axios');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const bodyparser = require('body-parser');

app.use(bodyparser.json());

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'/public/static/web/index.html'));
});

var nickname;
var chatNickName = []

app.post('/addNick', function (req, res) {
  for(var i = 0; i < chatNickName.length; i++){
    if(req.body.name == chatNickName[i].alias) {
      res.send({ message: "Namnet är upptaget, välj något annat! 😇"}, 403);
      return
    }
  }
  chatNickName.push(
    {
      alias: req.body.name
    }
  )
  res.send("Du har skapat ett alias");

})

io.on('connection', function(socket){
    console.log('a user connected');

    


    socket.on('disconnect', function(){
        console.log('user disconnected');
        socket.broadcast.emit('disconnected user', socket.nickname);
    });

    socket.on('userNickName', function(inputNickName){
      socket.nickname = inputNickName;
      socket.broadcast.emit('connected user', socket.nickname);
    })

    socket.on('chat message', function(msg){
        console.log('message: ' +msg + socket.nickname);
        io.emit('chat message', msg, socket.nickname);
    });

    socket.on('typing', function(typing){
        console.log('Någon skriver..' + typing + socket.nickname);
        io.emit('typing', typing, socket.nickname);
    });
});

http.listen(1337, function(){
  console.log('Listening on 1337');
});

