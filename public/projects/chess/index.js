//Initialize canvas element and prevent image smoothing.
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
//Handle window resize
(function () {
  var requestAnimationFrame =
    window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();
function resizeCanvas() {
  const minSize = Math.min(window.innerWidth, window.innerHeight);
  const baseSize = Math.round(minSize * 0.8);
  //we use % 8 to make sure the canvas size is evenly divisble by eight to prevent blurriness
  canvas.width = baseSize - (baseSize % 8);
  canvas.height = baseSize - (baseSize % 8);
}
window.addEventListener("resize", drawGame);
window.addEventListener("load", drawGame);

//Initialize drawing of the board/pieces, assign necessary data for each square on the board and each piece. Necessary for correct window resizing.
function drawGame() {
  resizeCanvas();
  const board = createBoardGrid();
  drawBoard(board);
  //We must return the board array for later use in the game loop to determine piece placement and tile selection. Recreating the board on resize must not effect game state.
  return board;
}
//Global Variables

//Functions

function createBoardGrid() {
  let boardGrid = [];
  for (let i = 0; i < 8; i++) {
    boardGrid[i] = [];
    for (let j = 0; j < 8; j++) {
      boardGrid[i][j] = {
        x: (j * canvas.width) / 8,
        y: (i * canvas.height) / 8,
        width: canvas.width / 8,
        height: canvas.height / 8,
        color: i % 2 === j % 2 ? "black" : "white",
        isSelected: false,
      };
    }
  }
  return boardGrid;
}
function drawBoard(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      ctx.fillStyle = board[i][j].color;
      ctx.fillRect(board[i][j].x, board[i][j].y, board[i][j].width, board[i][j].height);
    }
  }
}
