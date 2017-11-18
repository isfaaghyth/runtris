var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var md5 = require('md5');

app.use(express.static(__dirname + '/public'));

var participants = [];
var sessions = {};
var race = false;
io.on('connection', function(socket){
  socket.on('newSession', function(val){
    var sessionId = md5((new Date()).valueOf()).toUpperCase().substr(0,6);
    sessions[sessionId] = {
      sessionId : sessionId,
      state : val.state,
      p1 : {
        id : val.id,
        socketId : socket.id,
      }
    }
    socket.join(sessionId);
    io.to(socket.id).emit('sessionId', sessions[sessionId]);
  });
  socket.on('joinSession', function(val){ // { sessionId : x, id : y }
    console.log(val);
    console.log(sessions);
    if (sessions[val.sessionId] && !sessions[val.sessionId].p2) {
      sessions[val.sessionId].p2 = {
        id : val.id,
        socketId : socket.id,
      }
      sessions[val.sessionId].state = 'p2_joined';
      console.log('session found. Joined');
      socket.join(val.sessionId);
      io.to(val.sessionId).emit('teammateJoined', sessions[val.sessionId]);
    } else {
      console.log('session not found. join failed');
    }
  })
  socket.on('render', function(teammateSocketId, p, matrix, p1, p1Act){ // p should be p1 or p2
    console.log('render');
    io.to(teammateSocketId).emit('render', p, matrix, p1, p1Act);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
