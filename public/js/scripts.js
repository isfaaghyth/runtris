
window.socket = io();
window.lastAct = "";
window.session = {};
window.p1 = [4,1];
window.matrix = [
  [1,1,1],
  [1,1,1],
  [1,1],
  [1],
  [1],
  [1,2],
  [1],
  [1],
  [1],
  [1],
  [1,1],
  [1],
  [1],
  [1],
  [1,1],
  [1,1,1],
  [1,1,1,1],
  [1],
  [1],
  [1],
  [1],
  [1,1,],
  [1],
  [1],
  [1,0,1],
  [1,0,1],
  [1,0,1],
  [1,1,1],
  [1],
  [0],
  [1],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
]
window.currentPlayer = '';
window.teammatePlayer = '';
window.noSessionDiv = document.getElementById('no-session');
window.inSessionDiv = document.getElementById('in-session');



window.newGame = function(){
  var name = window.prompt('The initiator will be playing as P1. Please enter your nick : ');
  if (!name || (name && name.length < 1)) return alert('Your nick should not be empty');
  gameState = 'p1_initiated';
  socket.emit('newSession', {id : name, state : 'p1_initiated'});
}
var joinGame = function(){
  var name = window.prompt('You will be playing as P2. Please enter your nick : ');
  if (!name || (name && name.length < 1)) return alert('Your nick should not be empty');
  var sessionId = window.prompt('Please enter the sessionId that given by your teammate : ');
  if (!sessionId || (sessionId && sessionId.length < 1)) return alert('The sessionId should not be empty');
  socket.emit('joinSession', { sessionId : sessionId, id : name });
  currentPlayer = 'p2';
  teammatePlayer = 'p1';
}
var gameOver = function(){
  window.alert("Game over!");
  clearInterval(landLoop); 
}

var render = function(opt){
  opt = opt || {}
  if (!opt.p) {
    //send render to teammate
    // TODO should contains the action of p1
    socket.emit('render', session[teammatePlayer].socketId, currentPlayer,  matrix, p1, lastAct); 
  }
  // Check for the person blockDown
  var el = document.getElementById("land");
  el.innerHTML = "";
  for (var i in matrix) {
    var landblock = "<div class=\"landblock\">";
    for (var j = matrix[i].length-1;j >=0;j--) {
      if (matrix[i][j] == 1) {
        landblock += "<div class=\"block\"></div>";
      } else if (matrix[i][j] == 2) {
        landblock += "<div class=\"block block-person-" + lastAct + "\"></div>";
      } else if (matrix[i][j] == 3) {
        landblock += "<div class=\"block block-person-dead\"></div>";
      } else {
        landblock += "<div class=\"block block-empty\"></div>";
      }
    }
    landblock += "</div>";
    el.innerHTML += landblock;
  }
  if (opt.gameOver) {
    setTimeout(function(){
      gameOver();
    }, 100);
    return;
  }
  if (p1[0] < 0) {
    gameOver();
    return;
  }
}
function p1HandleKeys(e) {
  e = e || window.event;
  if (e.keyCode == '38') {
    lastAct = "up";
    // up arrow
    var nextBlock = matrix[p1[0]][p1[1]+1];
    var nextBlockUp = matrix[p1[0]+1][p1[1]+1];
    if (nextBlockUp == 1) return;
    console.log("right");
    if (nextBlock == 1) {
      return;
    }
    matrix[p1[0]][p1[1]] = 0;
    matrix[p1[0]][p1[1]+1] = 2;
    p1 = [p1[0], p1[1]+1];
    render();
    setTimeout(function(){
      matrix[p1[0]][p1[1]] = 0;
      matrix[p1[0]+1][p1[1]] = 2;
      p1 = [p1[0]+1, p1[1]];
      render();
      if (!matrix[p1[0]][p1[1]-1] || matrix[p1[0]][p1[1]-1] == 0) {
        var jump = 1;
        if (!matrix[p1[0]][p1[1]-2] || matrix[p1[0]][p1[1]-2] == 0) {
          jump = 2
        }
        matrix[p1[0]][p1[1]] = 0;
        if (p1[1]-jump == 0) {
          matrix[p1[0]+1][p1[1]-jump] = 3;
          render({gameOver:true});
        } else {
          if (matrix[p1[0]+1][p1[1]-jump] == 1) {
            matrix[p1[0]][p1[1]-jump] = 2;
            p1 = [p1[0], p1[1]-jump];
          } else {
            matrix[p1[0]+1][p1[1]-jump] = 2;
            p1 = [p1[0]+1, p1[1]-jump];

            nextBlockDown = matrix[p1[0]][p1[1]-1];
            var moreDown = 1;
            while(((nextBlockDown == 0 || nextBlockDown == 1) && p1[1] > 1) || !nextBlockDown) {
              matrix[p1[0]][p1[1]] = 0;
              matrix[p1[0]][p1[1]-moreDown] = 2;
              p1 = [p1[0], p1[1]-moreDown];
              nextBlockDown = matrix[p1[0]][p1[1]-moreDown];
            }
          /*
          */
          }
          render();
        }
      }
    }, 100);
  }
  else if (e.keyCode == '40') {
    // down arrow
  }
  else if (e.keyCode == '37') {
    lastAct = "left";
    // left arrow
    var nextBlock = matrix[p1[0]-1][p1[1]];
    var nextBlockDown = matrix[p1[0]-1][p1[1]-1];
    console.log("left");
    if (nextBlock == 1) {
      return;
    }
    if ((nextBlockDown == 0 && p1[1] > 1) || (!nextBlockDown)) {
      matrix[p1[0]][p1[1]] = 0;
      matrix[p1[0]-1][p1[1]] = 2;
      p1 = [p1[0]-1, p1[1]];
      render();
      setTimeout(function(){
        matrix[p1[0]][p1[1]] = 0;
        matrix[p1[0]][p1[1]-1] = 2;
        p1 = [p1[0], p1[1]-1];
        render();
      }, 100);
      return;
    }
    matrix[p1[0]][p1[1]] = 0;
    matrix[p1[0]-1][p1[1]] = 2;
    p1 = [p1[0]-1, p1[1]];
    render();
  }
  else if (e.keyCode == '39') {
    lastAct = "right";
    // right arrow
    var nextBlock = matrix[p1[0]+1][p1[1]];
    var nextBlockDown = matrix[p1[0]+1][p1[1]-1];
    console.log("right");
    if (nextBlock == 1) {
      return;
    }
    if (nextBlockDown == 0 && p1[1] == 1) {
      matrix[p1[0]][p1[1]] = 0;
      matrix[p1[0]+1][p1[1]-1] = 3;
      render({gameOver:true});
      return;
    }
    if ((nextBlockDown == 0 && p1[1] > 1) || (!nextBlockDown)) {
      matrix[p1[0]][p1[1]] = 0;
      matrix[p1[0]+1][p1[1]] = 2;
      p1 = [p1[0]+1, p1[1]];
      render();
      /*
      */
      setTimeout(function(){
        matrix[p1[0]][p1[1]] = 0;
        matrix[p1[0]][p1[1]-1] = 2;
        p1 = [p1[0], p1[1]-1];

    	nextBlockDown = matrix[p1[0]+1][p1[1]-1];
        var moreDown = 1;
	while(((nextBlockDown == 0 || nextBlockDown == 1) && p1[1] > 1) || !nextBlockDown) {
          matrix[p1[0]][p1[1]] = 0;
          matrix[p1[0]][p1[1]-moreDown] = 2;
          p1 = [p1[0], p1[1]-moreDown];
    	  nextBlockDown = matrix[p1[0]][p1[1]-moreDown];
	}
        render();
      }, 100);
      return;
    } else {
    matrix[p1[0]][p1[1]] = 0;
    matrix[p1[0]+1][p1[1]] = 2;
    p1 = [p1[0]+1, p1[1]];
    render();
    }
  }
}
var landLoop;
var startGame = function(){
  landLoop = setInterval(function(){
    matrix.shift();
    matrix.push([0]);
    // Update the person pos
    p1 = [p1[0]-1, p1[1]];
    console.log('p1 : ' + p1);
    render();
  }, 1000);
/*
  render();
*/
}
  
//render();
// Socket events
socket.on('render', function(p, mtx, p1, lastAct) {
  console.log(p);
  console.log(mtx);
  console.log(p1);
  window.lastAct = lastAct;
  window.matrix = mtx;
  window.p1 = p1;
  render({p, p});
});
socket.on('sessionId', function(session){
  console.log(session);
  alert('Your sessionId is ' + session.sessionId + ', please share this with your teammate');
  currentPlayer = 'p1';
  teammatePlayer = 'p2';
  noSessionDiv.className += 'hidden';
  inSessionDiv.textContent = 'SessionId : ' + session.sessionId + '. Nick : ' + session.p1.id + '. Please wait for your teammate...';
  inSessionDiv.className = '';
  session = session;
})

socket.on('teammateJoined', function(newSession){
  session = newSession;
  console.log(session);
  if (currentPlayer == 'p1') {
    document.onkeydown = p1HandleKeys;
    alert('Your teammate have been joined : ' + session.p2.id);
    inSessionDiv.textContent = 'SessionId : ' + session.sessionId + '. P1 : ' + session.p1.id + '. P2 : ' + session.p2.id + '. Ready!';
    inSessionDiv.className = '';
    startGame();
  } else {
    noSessionDiv.className += 'hidden';
    alert('You\'ve been  joined with : ' + session.p1.id);
    inSessionDiv.textContent = 'SessionId : ' + session.sessionId + '. P2 : ' + session.p2.id + '. P1 : ' + session.p1.id + '. Ready!';
    inSessionDiv.className = '';
  }
})
 
