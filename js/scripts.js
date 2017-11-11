var personPos = [4,1];
window.lastAct = "";
var matrix = [
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
  [1],
  [1],
  [1],
  [1],
  [1,1,1],
  [1],
  [1],
  [1,0,1],
  [1,0,1],
  [1,0,1],
  [1,1,1],
  [1],
  [0],
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

document.onkeydown = checkKey;
var gameOver = function(){
  window.alert("Game over!");
  clearInterval(landLoop); 
}

var render = function(opt){
  opt = opt || {}
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
  if (personPos[0] < 0) {
    gameOver();
    return;
  }
}
function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == '38') {
    lastAct = "up";
    // up arrow
    var nextBlock = matrix[personPos[0]][personPos[1]+1];
    console.log("right");
    console.log("nextBlock : " + nextBlock);
    if (nextBlock == 1) {
      return;
    }
    matrix[personPos[0]][personPos[1]] = 0;
    matrix[personPos[0]][personPos[1]+1] = 2;
    personPos = [personPos[0], personPos[1]+1];
    render();
    setTimeout(function(){
      matrix[personPos[0]][personPos[1]] = 0;
      matrix[personPos[0]+1][personPos[1]] = 2;
      personPos = [personPos[0]+1, personPos[1]];
      render();
      console.log(matrix[personPos[0]][personPos[1]-1]);
      if (!matrix[personPos[0]][personPos[1]-1] || matrix[personPos[0]][personPos[1]-1] == 0) {
        var jump = 1;
        if (!matrix[personPos[0]][personPos[1]-2] || matrix[personPos[0]][personPos[1]-2] == 0) {
          jump = 2
        }
        matrix[personPos[0]][personPos[1]] = 0;
        if (personPos[1]-jump == 0) {
          matrix[personPos[0]+1][personPos[1]-jump] = 3;
          render({gameOver:true});
        } else {
         console.log('yo');
          console.log(matrix[personPos[0]+1][personPos[1]-jump]);
          if (matrix[personPos[0]+1][personPos[1]-jump] == 1) {
            matrix[personPos[0]][personPos[1]-jump] = 2;
            personPos = [personPos[0], personPos[1]-jump];
          } else {
            matrix[personPos[0]+1][personPos[1]-jump] = 2;
            personPos = [personPos[0]+1, personPos[1]-jump];
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
    var nextBlock = matrix[personPos[0]-1][personPos[1]];
    var nextBlockDown = matrix[personPos[0]-1][personPos[1]-1];
    console.log("left");
    console.log("nextBlock : " + nextBlock);
    if (nextBlock == 1) {
      return;
    }
    if ((nextBlockDown == 0 && personPos[1] > 1) || (!nextBlockDown)) {
      matrix[personPos[0]][personPos[1]] = 0;
      matrix[personPos[0]-1][personPos[1]] = 2;
      personPos = [personPos[0]-1, personPos[1]];
      render();
      setTimeout(function(){
        matrix[personPos[0]][personPos[1]] = 0;
        matrix[personPos[0]][personPos[1]-1] = 2;
        personPos = [personPos[0], personPos[1]-1];
        render();
      }, 100);
      return;
    }
    matrix[personPos[0]][personPos[1]] = 0;
    matrix[personPos[0]-1][personPos[1]] = 2;
    personPos = [personPos[0]-1, personPos[1]];
    render();
  }
  else if (e.keyCode == '39') {
    lastAct = "right";
    // right arrow
    var nextBlock = matrix[personPos[0]+1][personPos[1]];
    var nextBlockDown = matrix[personPos[0]+1][personPos[1]-1];
    console.log("right");
    console.log("nextBlock : " + nextBlock);
    if (nextBlock == 1) {
      return;
    }
    console.log("nextBlockDown : " + nextBlockDown);
    console.log("personPos[1] : " + personPos[1]);
    if (nextBlockDown == 0 && personPos[1] == 1) {
      matrix[personPos[0]][personPos[1]] = 0;
      matrix[personPos[0]+1][personPos[1]-1] = 3;
      render({gameOver:true});
      return;
    }
    if ((nextBlockDown == 0 && personPos[1] > 1) || (!nextBlockDown)) {
      matrix[personPos[0]][personPos[1]] = 0;
      matrix[personPos[0]+1][personPos[1]] = 2;
      personPos = [personPos[0]+1, personPos[1]];
      render();
      setTimeout(function(){
        matrix[personPos[0]][personPos[1]] = 0;
        matrix[personPos[0]][personPos[1]-1] = 2;
        personPos = [personPos[0], personPos[1]-1];
        render();
      }, 100);
      return;
    }
    matrix[personPos[0]][personPos[1]] = 0;
    matrix[personPos[0]+1][personPos[1]] = 2;
    personPos = [personPos[0]+1, personPos[1]];
    render();
  }
}

var landLoop = setInterval(function(){
  matrix.shift();
  matrix.push([0]);
  // Update the person pos
  personPos = [personPos[0]-1, personPos[1]];
  console.log('personPos : ' + personPos);
  render();
}, 1000);
