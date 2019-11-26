const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'/public/static/web/index.html'));
});

app.post('/add', function(req, res){
  console.log("david")
});

// var chatNickName = []

// app.post('/addnick', function (req, res) {
//   console.log("daviddddd");
//   /* for(var i = 0; i < chatNickName.length; i++){
//     if(req.body.inputNickName == chatNickName[i].alias) {
//       alert("Namnet är upptaget, välj något annat! 😇");
//       return
//     }
//   }
//   chatNickName.push(
//     {
//       alias: req.body.inputNickName
//     }
//   ) */
//  /* res.send({}); */
// })

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

    socket.on('typing', function(typing){
        console.log('Någon skriver..' + typing);
        io.emit('typing', typing);
    });
});

http.listen(1337, function(){
  console.log('Listening on 1337');
});

