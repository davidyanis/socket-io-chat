const express = require('express');
const axios = require('axios');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const bodyparser = require('body-parser');

app.use(bodyparser.json());

app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

app.get('/joke', function(req, res){
    axios.get('https://api.yomomma.info/')
    .then(function (response) {
        res.send(response.data.joke)
    })
    .catch(function (error) {
        console.error(error);
    });
});

app.get('/gif', function(req, res){
    axios.get('https://api.tenor.com/v1/random?q=cat&key=KSA73B7YRX6Z')
    .then(function (response) {
        res.send(response.data.results[0].media[0].tinygif.url);
    })
    .catch(function (error) {
        console.error(error);
    });
});

io.on('connection', function(socket){
    console.log(socket.id);

    


    socket.on('disconnect', function(){
        console.log('user disconnected');
        socket.broadcast.emit('disconnected user', socket.nickname);
    });

    socket.on('userNickName', function(inputNickName){
      socket.nickname = inputNickName;
      socket.broadcast.emit('connected user', socket.nickname);
    })

    socket.on('chat message', function(msg){
        console.log('message: ' + msg + socket.nickname);
        io.emit('chat message', msg, socket.nickname);
    });

    socket.on('typing', function(typing){
        console.log('Någon skriver..' + typing + socket.nickname);
        socket.broadcast.emit('typing user', typing, socket.nickname);
    });

    socket.on('joke', function(joke){
        console.log(joke);
        io.emit('send joke', joke, socket.nickname);
    });

    socket.on('gif', function(gif){
        console.log(gif);
        io.emit('gif', gif, socket.nickname);
    });

});

http.listen(1337, function(){
  console.log('Listening on 1337');
});

