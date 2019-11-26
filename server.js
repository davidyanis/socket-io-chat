const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const axios = require('axios')

app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'/public/static/web/index.html'));
});

app.get('/joke', function(req, res){
    axios.get('https://api.yomomma.info/')
    .then(function (response) {
        res.send(response.data.joke)
    })
    .catch(function (error) {
        console.error(error);
    });
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

    socket.on('typing', function(typing){
        console.log('Någon skriver..' + typing);
        io.emit('typing', typing);
    });

    socket.on('joke', function(responseData){
        io.emit('joke', responseData);
    });
});

http.listen(1337, function(){
  console.log('Listening on 1337');
});