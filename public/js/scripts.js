
window.socket = io();
window.lastAct = "";
window.session = {};
window.p1 = [4,1];
window.p2 = [0,0];
window.currentTetro = -1;
window.currentTetroRotate = 0;
window.matrixP1 = [
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
  [1],
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
  [1],
  [1],
  [1],
  [1,1],
  [1,1,1],
  [1,1],
  [1],
  [1],
  [1],
  [1],
  [1],
  [1],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
]
window.tetrominos = [
  [ // straight
    [2],
    [2],
    [2],
    [2],
  ],
  [ // square
    [2,2],
    [2,2],
  ],
  [ // tpoly
    [2,2,2],
    [0,2,0],
  ],
  [ // jack
    [0,2],
    [0,2],
    [2,2],
  ],
  [ // stack
    [0,2,2],
    [2,2,0],
  ],
]

var getNewTetro = function(){
 var ran = Math.floor(Math.random() * (5 - 1 + 1));
  currentTetro = ran;
  currentTetroRotate = 0;
  var tetro = tetrominos[ran];
  for (var i in tetro) {
    for (var j in tetro[i]) {
      window.matrixP2[11 - i][21 - j] = tetro[i][j];
      if (i == tetro.length - 1 && j == tetro[i].length - 1) {
        window.p2 = [11-i, 21 -j];
      }
    }
  }
  console.log("p2 : " + window.p2);
}

var tetroMoveLeft = function(){
  console.log(p2);
  if (p2[0] == 0) {
    return;
  }
  for (var i=0; i < 5; i++) {
    for (var j=0; j < 5; j++) {
      if (matrixP2[p2[0]+i][p2[1]+j] > 0) {
        matrixP2[p2[0]+i][p2[1]+j] = 0;
        matrixP2[p2[0]+i-1][p2[1]+j] = 2;
      }
    }
  } 
  window.p2 = [p2[0]-1,p2[1]];
  console.log("p2 : " + window.p2);
  renderTetris();
}

var tetroMoveRight = function(){
  console.log(p2);
  if (p2[1] == 21) {
    return;
  }
  for (var i=0; i < 5; i++) {
    for (var j=0; j < 5; j++) {
      if (matrixP2[p2[0]+i][p2[1]+j] > 0) {
        matrixP2[p2[0]+i+1][p2[1]+j] = 2;
        matrixP2[p2[0]+i][p2[1]+j] = 0;
      }
    }
  } 
  window.p2 = [p2[0]+1,p2[1]];
  console.log("p2 : " + window.p2);
  renderTetris();
}

var tetroMoveDown = function(){
  console.log(p2);
  var bottom = false;
  if (p2[1] == 1) {
    bottom = true;
  }
  for (var i=0; i < 5; i++) {
    for (var j=0; j < 5; j++) {
      if (matrixP2[p2[0]+i][p2[1]+j] > 0) {
        if (bottom) {
          matrixP1[22+p2[0]+i][p2[1]-1+j] = 1;
          matrixP2[p2[0]+i][p2[1]+j] = 0;
        } else {
          matrixP2[p2[0]+i][p2[1]+j] = 0;
          matrixP2[p2[0]+i][p2[1]-1+j] = 2;
        }
      }
    }
  } 
  window.p2 = [p2[0],p2[1]-1];
  console.log("p2 : " + window.p2);
  renderTetris();
  if (bottom) {
    render();
    getNewTetro();
  }
}

var rotateClockwise = function(matrix) {
  // reverse the rows
  matrix = matrix.reverse();
  // swap the symmetric elements
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < i; j++) {
      var temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
};

var tetroRotate = function(){
  if (currentTetro == 1 || currentTetro == 0) {
    return;
  }
  if (currentTetroRotate == 3) {
    currentTetroRotate = 0;
  } else {
    currentTetroRotate++;
  }
  console.log(p2);
  var bottom = false;
  if (p2[1] == 1) {
    bottom = true;
  }
  var currentMatrix = [
  ];
  for (var i=0; i < 5; i++) {
    for (var j=0; j < 5; j++) {
      if (!currentMatrix[i]) {
        currentMatrix.push([]);
      }
      currentMatrix[i][j] = matrixP2[p2[0]-1+i][p2[1]-1+j] || 0;
    }
  } 
  console.log(JSON.stringify(currentMatrix));
  rotateClockwise(currentMatrix);
  console.log(JSON.stringify(currentMatrix));
  var verticalMargin = 1;
  var horizontalMargin = 0;
  for (var i in currentMatrix[1]) {
    if(currentMatrix[1][i] > 0) {
      var verticalMargin = 0;
    }
  }
  for (var i=0; i < 5; i++) {
    for (var j=0; j < 5; j++) {
      matrixP2[p2[0]-1-verticalMargin+i][p2[1]-1-horizontalMargin+j] = currentMatrix[i][j];
    }
  } 
  window.p2 = [p2[0],p2[1]-1];
  console.log("p2 : " + window.p2);
  renderTetris();
  if (bottom) {
    render();
    getNewTetro();
  }
  /*
  */
}


window.matrixP2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
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

var renderTetris = function(opt){
  opt = opt || {}
  if (!opt.p) {
    socket.emit('render', session[teammatePlayer].socketId, currentPlayer,  matrixP2, p1, 'tetrojoin'); 
  }
  var tetrisEl = document.getElementById("tetriscreen");
  tetrisEl.innerHTML = "";
  for (var i in matrixP2) {
    var landblock = "<div class=\"landblock\">";
    for (var j = matrixP2[i].length-1;j >=0;j--) {
      if (matrixP2[i][j] == 1 || matrixP2[i][j] == 2) {
        landblock += "<div class=\"block\"></div>";
      } else {
        landblock += "<div class=\"block block-empty\"></div>";
      }
    }
    landblock += "</div>";
    tetrisEl.innerHTML += landblock;
  }
}

var render = function(opt){
  opt = opt || {}
  if (!opt.p) {
    //send render to teammate
    // TODO disable to fast debug rendering
    socket.emit('render', session[teammatePlayer].socketId, currentPlayer,  matrixP1, p1, lastAct); 
  }
  // Check for the person blockDown

  var el = document.getElementById("land");
  el.innerHTML = "";
  for (var i in matrixP1) {
    var landblock = "<div class=\"landblock\">";
    for (var j = matrixP1[i].length-1;j >=0;j--) {
      if (matrixP1[i][j] == 1) {
        landblock += "<div class=\"block\"></div>";
      } else if (matrixP1[i][j] == 2) {
        landblock += "<div class=\"block block-person-" + lastAct + "\"></div>";
      } else if (matrixP1[i][j] == 3) {
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
/*
*/
}
function p2HandleKeys(e) {
  e = e || window.event;
  if (e.keyCode == '40') {
    // down arrow
    tetroMoveDown();
  } else if (e.keyCode == '37') {
    tetroMoveLeft();
  } else if (e.keyCode == '39') {
    //tetroMoveRight();
  } else if (e.keyCode == '38') {
    tetroRotate();
  }
}
function p1HandleKeys(e) {
  e = e || window.event;
  if (e.keyCode == '38') {
    if (p1[0] > 19) return;
    lastAct = "up";
    // up arrow
    var nextBlock = matrixP1[p1[0]][p1[1]+1];
    var nextBlockUp = matrixP1[p1[0]+1][p1[1]+1];
    if (nextBlockUp == 1) return;
    console.log("right");
    if (nextBlock == 1) {
      return;
    }
    matrixP1[p1[0]][p1[1]] = 0;
    matrixP1[p1[0]][p1[1]+1] = 2;
    p1 = [p1[0], p1[1]+1];
    render();
    setTimeout(function(){
      matrixP1[p1[0]][p1[1]] = 0;
      matrixP1[p1[0]+1][p1[1]] = 2;
      p1 = [p1[0]+1, p1[1]];
      render();
      if (!matrixP1[p1[0]][p1[1]-1] || matrixP1[p1[0]][p1[1]-1] == 0) {
        var jump = 1;
        if (!matrixP1[p1[0]][p1[1]-2] || matrixP1[p1[0]][p1[1]-2] == 0) {
          jump = 2
        }
        matrixP1[p1[0]][p1[1]] = 0;
        if (p1[1]-jump == 0) {
          matrixP1[p1[0]+1][p1[1]-jump] = 3;
          render({gameOver:true});
        } else {
          if (matrixP1[p1[0]+1][p1[1]-jump] == 1) {
            matrixP1[p1[0]][p1[1]-jump] = 2;
            p1 = [p1[0], p1[1]-jump];
          } else {
            matrixP1[p1[0]+1][p1[1]-jump] = 2;
            p1 = [p1[0]+1, p1[1]-jump];

            nextBlockDown = matrixP1[p1[0]][p1[1]-1];
            var moreDown = 1;
            while(((nextBlockDown == 0 || nextBlockDown == 1) && p1[1] > 1) || !nextBlockDown) {
              matrixP1[p1[0]][p1[1]] = 0;
              matrixP1[p1[0]][p1[1]-moreDown] = 2;
              p1 = [p1[0], p1[1]-moreDown];
              nextBlockDown = matrixP1[p1[0]][p1[1]-moreDown];
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
    var nextBlock = matrixP1[p1[0]-1][p1[1]];
    var nextBlockDown = matrixP1[p1[0]-1][p1[1]-1];
    console.log("left");
    if (nextBlock == 1) {
      return;
    }
    if ((nextBlockDown == 0 && p1[1] > 1) || (!nextBlockDown)) {
      matrixP1[p1[0]][p1[1]] = 0;
      matrixP1[p1[0]-1][p1[1]] = 2;
      p1 = [p1[0]-1, p1[1]];
      render();
      setTimeout(function(){
        matrixP1[p1[0]][p1[1]] = 0;
        matrixP1[p1[0]][p1[1]-1] = 2;
        p1 = [p1[0], p1[1]-1];
        render();
      }, 100);
      return;
    }
    matrixP1[p1[0]][p1[1]] = 0;
    matrixP1[p1[0]-1][p1[1]] = 2;
    p1 = [p1[0]-1, p1[1]];
    render();
  }
  else if (e.keyCode == '39') {
    if (p1[0] > 19) return;
    lastAct = "right";
    // right arrow
    var nextBlock = matrixP1[p1[0]+1][p1[1]];
    var nextBlockDown = matrixP1[p1[0]+1][p1[1]-1];
    console.log("right");
    if (nextBlock == 1) {
      return;
    }
    if (nextBlockDown == 0 && p1[1] == 1) {
      matrixP1[p1[0]][p1[1]] = 0;
      matrixP1[p1[0]+1][p1[1]-1] = 3;
      render({gameOver:true});
      return;
    }
    if ((nextBlockDown == 0 && p1[1] > 1) || (!nextBlockDown)) {
      matrixP1[p1[0]][p1[1]] = 0;
      matrixP1[p1[0]+1][p1[1]] = 2;
      p1 = [p1[0]+1, p1[1]];
      render();
      /*
      */
      setTimeout(function(){
        matrixP1[p1[0]][p1[1]] = 0;
        matrixP1[p1[0]][p1[1]-1] = 2;
        p1 = [p1[0], p1[1]-1];

    	nextBlockDown = matrixP1[p1[0]+1][p1[1]-1];
        var moreDown = 1;
	while(((nextBlockDown == 0 || nextBlockDown == 1) && p1[1] > 1) || !nextBlockDown) {
          matrixP1[p1[0]][p1[1]] = 0;
          matrixP1[p1[0]][p1[1]-moreDown] = 2;
          p1 = [p1[0], p1[1]-moreDown];
    	  nextBlockDown = matrixP1[p1[0]][p1[1]-moreDown];
	}
        render();
      }, 100);
      return;
    } else {
    matrixP1[p1[0]][p1[1]] = 0;
    matrixP1[p1[0]+1][p1[1]] = 2;
    p1 = [p1[0]+1, p1[1]];
    render();
    }
  }
}
var landLoop;
var tetrisLoop;
var startGame = function(){
  landLoop = setInterval(function(){
    if (currentPlayer == 'p1') {
      matrixP1.shift();
      matrixP1.push([0]);
      // Update the person pos
      p1 = [p1[0]-1, p1[1]];
      console.log('p1 : ' + p1);
      render();
    } else {
      tetroMoveDown();
    }
  }, 1000);
/*
  render();
*/
}
/*
startGame();
document.onkeydown = p2HandleKeys;
tetroMoveDown();
*/

//render();
// Socket events
socket.on('render', function(p, mtx, p1, lastAct) { // player, currentMatrix, playerPosition, lastAction
  console.log('on render');
  console.log(p);
  console.log(mtx);
  console.log(p1);
  if (lastAct == 'tetrojoin') {
    window.matrixP2 = mtx;
    renderTetris({p, p});
  } else {
    window.lastAct = lastAct;
    window.matrixP1 = mtx;
    window.p1 = p1;
    render({p, p});
  }
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
    document.onkeydown = p2HandleKeys;
    noSessionDiv.className += 'hidden';
    alert('You\'ve been  joined with : ' + session.p1.id);
    inSessionDiv.textContent = 'SessionId : ' + session.sessionId + '. P2 : ' + session.p2.id + '. P1 : ' + session.p1.id + '. Ready!';
    inSessionDiv.className = '';
    getNewTetro();
    startGame();
  }
})
