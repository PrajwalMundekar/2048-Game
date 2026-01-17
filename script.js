
// DOM references
const boardElement = document.getElementById("board");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("gameOver");

// Game state
const size = 4;
let board = [];
let score = 0;

// --------------------
// Game Initialization
// --------------------
function initGame() {
  board = Array.from({ length: size }, () => Array(size).fill(0));
  score = 0;
  scoreElement.textContent = score;
  gameOverElement.classList.add("hidden");

  addRandomTile();
  addRandomTile();
  renderBoard();
}

// --------------------
// Utilities
// --------------------
function arraysEqual(a, b) {
  return a.every((val, i) => val === b[i]);
}

function updateGame() {
  scoreElement.textContent = score;
  renderBoard();

  if (isGameOver()) {
    gameOverElement.classList.remove("hidden");
  }
}

// --------------------
// Tile Logic
// --------------------
function addRandomTile() {
  const empty = [];

  board.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === 0) empty.push({ r, c });
    });
  });

  if (empty.length === 0) return;

  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function slideAndMerge(row) {
  let arr = row.filter(v => v !== 0);

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
    }
  }

  arr = arr.filter(v => v !== 0);
  while (arr.length < size) arr.push(0);

  return arr;
}

// --------------------
// Movement Functions
// --------------------
function moveLeft() {
  let moved = false;

  for (let r = 0; r < size; r++) {
    const original = [...board[r]];
    const merged = slideAndMerge(board[r]);
    board[r] = merged;
    if (!arraysEqual(original, merged)) moved = true;
  }

  if (moved) {
    addRandomTile();
    updateGame();
  }
}

function moveRight() {
  let moved = false;

  for (let r = 0; r < size; r++) {
    const original = [...board[r]];
    const merged = slideAndMerge([...board[r]].reverse()).reverse();
    board[r] = merged;
    if (!arraysEqual(original, merged)) moved = true;
  }

  if (moved) {
    addRandomTile();
    updateGame();
  }
}

function moveUp() {
  let moved = false;

  for (let c = 0; c < size; c++) {
    const column = board.map(row => row[c]);
    const original = [...column];
    const merged = slideAndMerge(column);

    for (let r = 0; r < size; r++) {
      board[r][c] = merged[r];
    }

    if (!arraysEqual(original, merged)) moved = true;
  }

  if (moved) {
    addRandomTile();
    updateGame();
  }
}

function moveDown() {
  let moved = false;

  for (let c = 0; c < size; c++) {
    const column = board.map(row => row[c]);
    const original = [...column];
    const merged = slideAndMerge(column.reverse()).reverse();

    for (let r = 0; r < size; r++) {
      board[r][c] = merged[r];
    }

    if (!arraysEqual(original, merged)) moved = true;
  }

  if (moved) {
    addRandomTile();
    updateGame();
  }
}

// --------------------
// Keyboard Controls
// --------------------
document.addEventListener("keydown", e => {
  if (gameOverElement.classList.contains("hidden") === false) return;

  switch (e.key) {
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    case "ArrowUp":
      moveUp();
      break;
    case "ArrowDown":
      moveDown();
      break;
  }
});

// --------------------
// Mobile Swipe Controls
// --------------------
let startX = 0;
let startY = 0;

document.addEventListener("touchstart", e => {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
}, { passive: true });

document.addEventListener("touchend", e => {
  e.preventDefault();

  const touch = e.changedTouches[0];
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;

  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    dx > 0 ? moveRight() : moveLeft();
  } else {
    dy > 0 ? moveDown() : moveUp();
  }
}, { passive: false });

// --------------------
// Game Over Logic
// --------------------
function isGameOver() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) return false;
      if (c < size - 1 && board[r][c] === board[r][c + 1]) return false;
      if (r < size - 1 && board[r][c] === board[r + 1][c]) return false;
    }
  }
  return true;
}

// --------------------
// Render Board
// --------------------
function renderBoard() {
  boardElement.innerHTML = "";

  board.forEach(row => {
    row.forEach(value => {
      const tile = document.createElement("div");
      tile.className = "tile";

      if (value !== 0) {
        tile.textContent = value;
        tile.classList.add(`tile-${value}`);
      }

      boardElement.appendChild(tile);
    });
  });
}

// Start game
initGame();
