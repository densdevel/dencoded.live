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
    alert(player2 + " wins!");
    return;
  }
  alert(player1 + " wins!");
  return;
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

// Evaluate board position for minimax
function evaluateBoard(board, playerType) {
  let score = 0;

  // Check horizontal windows
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      score += evaluateWindow([board[col][row].type, board[col + 1][row].type, board[col + 2][row].type, board[col + 3][row].type], playerType);
    }
  }

  // Check vertical windows
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row < 3; row++) {
      score += evaluateWindow([board[col][row].type, board[col][row + 1].type, board[col][row + 2].type, board[col][row + 3].type], playerType);
    }
  }

  // Check diagonal windows (positive slope)
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 3; row++) {
      score += evaluateWindow([board[col][row].type, board[col + 1][row + 1].type, board[col + 2][row + 2].type, board[col + 3][row + 3].type], playerType);
    }
  }

  // Check diagonal windows (negative slope)
  for (let col = 0; col < 4; col++) {
    for (let row = 3; row < 6; row++) {
      score += evaluateWindow([board[col][row].type, board[col + 1][row - 1].type, board[col + 2][row - 2].type, board[col + 3][row - 3].type], playerType);
    }
  }

  return score;
}

// Evaluate a window of 4 positions
function evaluateWindow(window, playerType) {
  const opponentType = playerType === 0 ? 1 : 0;
  let score = 0;

  // Count pieces in window
  const playerCount = window.filter((type) => type === playerType).length;
  const opponentCount = window.filter((type) => type === opponentType).length;
  const emptyCount = window.filter((type) => type === -1).length;

  // Score the window
  if (playerCount === 4) {
    score += 100; // Win
  } else if (playerCount === 3 && emptyCount === 1) {
    score += 5; // Three in a row
  } else if (playerCount === 2 && emptyCount === 2) {
    score += 2; // Two in a row with two empty spaces
  }

  // Check for the specific pattern [o-oo] or [oo-o]
  if (playerCount === 3 && emptyCount === 1) {
    // Check for pattern [o-oo]
    if (
      (window[0] === playerType && window[1] === -1 && window[2] === playerType && window[3] === playerType) ||
      (window[0] === playerType && window[1] === playerType && window[2] === -1 && window[3] === playerType)
    ) {
      score += 8; // This pattern is very strong
    }
  }

  // Block opponent
  if (opponentCount === 3 && emptyCount === 1) {
    score -= 4; // Block opponent's three in a row

    // Check for opponent's pattern [o-oo]
    if (
      (window[0] === opponentType && window[1] === -1 && window[2] === opponentType && window[3] === opponentType) ||
      (window[0] === opponentType && window[1] === opponentType && window[2] === -1 && window[3] === opponentType)
    ) {
      score -= 8; // Block this pattern with higher priority
    }
  }

  return score;
}

// Find valid locations for next move
function getValidLocations(board) {
  const validLocations = [];
  for (let col = 0; col < 7; col++) {
    if (!columnFull(col, board)) {
      validLocations.push(col);
    }
  }
  return validLocations;
}

// Get next open row in a column
function getNextOpenRow(board, col) {
  for (let row = 5; row >= 0; row--) {
    if (board[col][row].color === null) {
      return row;
    }
  }
  return -1;
}

// Make a temporary move
function makeMove(board, col, playerType, playerColor) {
  const row = getNextOpenRow(board, col);
  board[col][row].type = playerType;
  board[col][row].color = playerColor;
  return board;
}

// Minimax algorithm with alpha-beta pruning
function minimax(board, depth, alpha, beta, maximizingPlayer) {
  const validLocations = getValidLocations(board);

  // Check for terminal node (win, lose, or full board)
  const isTerminal = checkWins(board, true) || validLocations.length === 0;
  if (depth === 0 || isTerminal) {
    if (isTerminal) {
      // If AI wins
      if (checkWins(board, true) && turn === 1) {
        return [null, 1000000];
      }
      // If player wins
      else if (checkWins(board, true) && turn === 0) {
        return [null, -1000000];
      }
      // Game is over, no more valid moves
      else {
        return [null, 0];
      }
    } else {
      // Evaluate board position
      return [null, evaluateBoard(board, turn)];
    }
  }

  if (maximizingPlayer) {
    let value = -Infinity;
    let column = validLocations[0];

    for (let col of validLocations) {
      const tempBoard = createGrid(7, 6);
      copyValues(board, tempBoard);

      // Make move for AI
      makeMove(tempBoard, col, 1, p2color);

      const newScore = minimax(tempBoard, depth - 1, alpha, beta, false)[1];

      if (newScore > value) {
        value = newScore;
        column = col;
      }

      alpha = Math.max(alpha, value);
      if (alpha >= beta) {
        break; // Beta cutoff
      }
    }

    return [column, value];
  } else {
    let value = Infinity;
    let column = validLocations[0];

    for (let col of validLocations) {
      const tempBoard = createGrid(7, 6);
      copyValues(board, tempBoard);

      // Make move for player
      makeMove(tempBoard, col, 0, p1color);

      const newScore = minimax(tempBoard, depth - 1, alpha, beta, true)[1];

      if (newScore < value) {
        value = newScore;
        column = col;
      }

      beta = Math.min(beta, value);
      if (alpha >= beta) {
        break; // Alpha cutoff
      }
    }

    return [column, value];
  }
}

function computerMove(arr) {
  // Use minimax algorithm to find the best move
  const depth = 4; // Look ahead 4 moves (adjust for difficulty)
  const column = minimax(arr, depth, -Infinity, Infinity, true)[0];

  // If minimax returns a valid column, play it
  if (column !== null && !columnFull(column, arr)) {
    playMove(column, arr);
    return;
  }

  // Fallback to simple strategy if minimax fails
  let tempArr = createGrid(7, 6);
  const testWin = true;

  // Check for opponent's immediate win and block it
  turn = (turn + 1) % 2; // Switch to player's perspective
  for (let i = 0; i < arr.length; i++) {
    if (columnFull(i, arr)) continue;

    copyValues(arr, tempArr);
    playMove(i, tempArr);
    if (checkWins(tempArr, testWin)) {
      turn = (turn + 1) % 2; // Switch back to AI
      playMove(i, arr);
      return;
    }
  }
  turn = (turn + 1) % 2; // Switch back to AI

  // Play in the center if possible
  if (!columnFull(3, arr)) {
    playMove(3, arr);
    return;
  }

  // Play randomly as a last resort
  let random = getRandomInt(7);
  let attempts = 0;
  while (columnFull(random, arr) && attempts < 20) {
    random = getRandomInt(7);
    attempts++;
  }

  if (!columnFull(random, arr)) {
    playMove(random, arr);
  }
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
