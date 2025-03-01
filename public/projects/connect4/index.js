const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
(function () {
  var requestAnimationFrame =
    window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

/*
    GLOBAL VARIABLES
  */
//Assets
const startRed = document.getElementById("startRed");
const startYellow = document.getElementById("startYellow");
const board = new Image();
board.src = "assets/board.png";
const redChip = new Image();
redChip.src = "assets/red.png";
const yellowChip = new Image();
yellowChip.src = "assets/yellow.png";
const boardGrid = createGrid(7, 6);
function createGrid(cols, rows) {
  let arr = [];
  for (let i = 0; i < cols; i += 1) {
    arr.push([]);
    for (let j = 0; j < rows; j++) {
      arr[i].push({
        x: i * 49 + 6,
        y: j * 49 + 3,
        width: 47,
        height: 47,
        color: null,
        type: -1, // -1 = none, 0 = player1, 1 = player2
      });
    }
  }
  return arr;
}

//Game state
var turn = 0; // 0 = player1, 1 = player2
var gameStarted = false;
var p1color = null;
var p2color = null;
var player1 = null;
var player2 = null;
var player1Wins = 0;
var player2Wins = 0;

function drawBoard() {
  board.onload = () => {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(board, 0, 0, board.width, board.height);
  };
}

function columnFull(col, arr) {
  if (arr[col][0].color !== null) {
    return true;
  }
  return false;
}

function playMove(col, arr) {
  if (columnFull(col, arr)) {
    return;
  }
  for (let i = 5; i >= 0; i--) {
    if (arr[col][i].color === null) {
      if (turn === 0) {
        arr[col][i].color = p1color;
        arr[col][i].type = 0;
        return;
      }
      arr[col][i].color = p2color;
      arr[col][i].type = 1;
      return;
    }
  }
}

function drawPieces() {
  for (let i = 0; i < boardGrid.length; i++) {
    for (let j = 0; j < boardGrid[0].length; j++) {
      if (boardGrid[i][j].color === null) {
        continue;
      }
      ctx.drawImage(boardGrid[i][j].color, boardGrid[i][j].x, boardGrid[i][j].y, boardGrid[i][j].width, boardGrid[i][j].height);
    }
  }
  requestAnimationFrame(drawPieces);
}

function checkWins(arr, testWin) {
  //for cols
  for (let i = 0; i < arr.length; i++) {
    //for item in col
    for (let j = 5; j > 2; j--) {
      if (boardGrid[i][j].color !== null) {
        let vertConnected = 0;
        let color = boardGrid[i][j].color;
        for (let k = 1; k < 4; k++) {
          if (boardGrid[i][j - k].color === color) {
            vertConnected++;
          }
        }
        if (vertConnected >= 3) {
          if (testWin) {
            return true;
          }
          gameStarted = false;
          if (turn === 1) {
            player2Wins++;
            setTimeout(() => gameEnded(turn), 100);
            return;
          }
          player1Wins++;
          setTimeout(() => gameEnded(turn), 100);
          return;
        }
      }
    }
  }
  for (let i = 0; i < arr.length - 3; i++) {
    //for cols 0 - 4 from left to right
    for (let j = 5; j >= 0; j--) {
      //for item of col
      if (boardGrid[i][j].color !== null) {
        let horizConnected = 0;
        let color = boardGrid[i][j].color;
        for (let k = 1; k < 4; k++) {
          if (boardGrid[i + k][j].color === color) {
            horizConnected++;
          }
        }
        if (horizConnected >= 3) {
          if (testWin) {
            return true;
          }
          gameStarted = false;
          if (turn === 1) {
            player2Wins++;
            setTimeout(() => gameEnded(turn), 100);
            return;
          }
          player1Wins++;
          setTimeout(() => gameEnded(turn), 100);
          return;
        }
      }
    }
  }
  for (let i = 0; i < arr.length - 3; i++) {
    //check diagonal wins
    for (let j = 5; j >= 3; j--) {
      if (boardGrid[i][j].color !== null) {
        let diagConnected = 0;
        let color = boardGrid[i][j].color;
        for (let k = 1; k < 4; k++) {
          if (boardGrid[i + k][j - k].color === color) {
            diagConnected++;
          }
        }
        if (diagConnected >= 3) {
          if (testWin) {
            return true;
          }
          gameStarted = false;
          if (turn === 1) {
            player2Wins++;
            setTimeout(() => gameEnded(turn), 100);
            return;
          }
          player1Wins++;
          setTimeout(() => gameEnded(turn), 100);
          return;
        }
      }
    }
    for (let j = 2; j >= 0; j--) {
      if (boardGrid[i][j].color !== null) {
        let diagConnected = 0;
        let color = boardGrid[i][j].color;
        for (let k = 1; k < 4; k++) {
          if (boardGrid[i + k][j + k].color === color) {
            diagConnected++;
          }
        }
        if (diagConnected >= 3) {
          if (testWin) {
            return true;
          }
          gameStarted = false;
          if (turn === 1) {
            gameStarted = false;
            player2Wins++;
            gameEnded(turn);
            return;
          }
          gameStarted = false;
          player1Wins++;
          gameEnded(turn);
          return;
        }
      }
    }
  }
}

function gameEnded(turn) {
  if (turn === 0) {
    alert(player1 + " wins!");
    return;
  }
  alert(player2 + " wins!");
}

function threeInARow(arr) {
  for (let i = 1; i < 4; i++) {
    for (let j = 0; j < arr[0].length; j++) {
      if (j === 5) {
        if (arr[i][j].color === arr[i + 1][j].color && arr[i + 1][j].color === arr[i + 2][j].color) {
          return true;
        }
      }
      if (arr[i - 1][j + 1].color !== null && arr[i + 3][j + 1].color !== null) {
        if (arr[i][j].color === arr[i + 1][j].color && arr[i + 1][j].color === arr[i + 2][j].color) {
          return true;
        }
      }
    }
  }
  return false;
}

function copyValues(arr, newArr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < 6; j++) {
      newArr[i][j].color = arr[i][j].color;
      newArr[i][j].type = arr[i][j].type;
    }
  }
  return newArr;
}

function computerMove(arr) {
  let tempArr = createGrid(7, 6);
  let testWin = true;
  copyValues(arr, tempArr);
  //Check for win on next move and play it OR check for opponent win on next move and block it
  for (let i = 0; i < arr.length; i++) {
    playMove(i, tempArr);
    if (checkWins(tempArr, testWin)) {
      playMove(i, arr);
      console.log("move played");
      return;
    }
    copyValues(arr, tempArr);
    turn = (turn + 1) % 2;
    console.log(tempArr);
    playMove(i, tempArr);
    if (checkWins(tempArr, testWin)) {
      playMove(i, arr);
      console.log("move played 2");
      return;
    }
    turn = (turn + 1) % 2;
    copyValues(arr, tempArr);
  }
  //Check for 3 in a row with empty space on either side playable on next move by either player and play/block it
  // for (let i = 0; i < arr.length; i++) {
  //   playMove(i, tempArr);
  //   if (threeInARow(tempArr)) {
  //     playMove(i, arr);
  //     return;
  //   }
  //   tempArr = [...arr];
  //   turn = (turn + 1) % 2;
  //   playMove(i, arr);
  //   if (threeInARow(tempArr)) {
  //     turn = (turn + 1) % 2;
  //     playMove(i, arr);
  //     return;
  //   }
  //   tempArr = [...arr];
  // }
  // Play randomly
  let random = getRandomInt(6);
  while (columnFull(random, arr)) {
    random = getRandomInt(6);
  }
  playMove(random, arr);
  return;
}

drawBoard();
drawPieces();

canvas.addEventListener("click", function (e) {
  const selectedCol = Math.floor(e.offsetX / 50);

  if (turn === 0 && gameStarted) {
    playMove(selectedCol, boardGrid); // Player's move
    checkWins(boardGrid, false);
    turn = 1;
  }
  if (turn === 1 && gameStarted) {
    computerMove(boardGrid); // Computer's move
    checkWins(boardGrid, false);
    turn = 0;
  }
});
startRed.onclick = () => {
  gameStarted = true;
  player1 = "red";
  p1color = redChip;
  player2 = "yellow";
  p2color = yellowChip;
  startRed.remove();
  startYellow.remove();
};
startYellow.onclick = () => {
  gameStarted = true;
  player1 = "yellow";
  p1color = yellowChip;
  player2 = "red";
  p2color = redChip;
  startYellow.remove();
  startRed.remove();
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
