$(function () {
    var socket = io();
    $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });

    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });
    socket.on('connected user', function() {
      $('#messages').append($('<li>').text('user has connected'));
    });
    socket.on('disconnected user', function() {
      $('#messages').append($('<li>').text('user has disconnected'));
    });
});