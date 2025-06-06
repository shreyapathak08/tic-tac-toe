// script.js

// DOM Elements
const setup = document.getElementById('setup');
const startBtn = document.getElementById('startBtn');
const board = document.getElementById('board');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const logoPickers = document.querySelectorAll('.logo-option');

let players = [
  { name: '', logo: '' },
  { name: '', logo: '' }
];
let currentPlayer = 0;
let gameActive = false;
let boardState = ['', '', '', '', '', '', '', '', ''];

// Winning combinations
const winningCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// Select logo for player
logoPickers.forEach(picker => {
  picker.addEventListener('click', () => {
    const selectedPlayer = picker.dataset.player;
    logoPickers.forEach(lp => {
      if (lp.dataset.player === selectedPlayer) {
        lp.classList.remove('selected');
      }
    });
    picker.classList.add('selected');
    players[selectedPlayer].logo = picker.textContent;
  });
});

// Start game after setup validation
startBtn.addEventListener('click', () => {
  const p1Name = document.getElementById('player1').value.trim() || 'Player 1';
  const p2Name = document.getElementById('player2').value.trim() || 'Player 2';

  // Validate logos selected
  if (!players[0].logo || !players[1].logo) {
    alert('Please select a logo for both players!');
    return;
  }

  players[0].name = p1Name;
  players[1].name = p2Name;

  // Disable setup and show board
  setup.style.display = 'none';
  board.style.display = 'grid';
  restartBtn.style.display = 'inline-block';

  resetBoard();
  gameActive = true;
  currentPlayer = 0;
  updateStatus();
});

// Reset the board UI and state
function resetBoard() {
  board.innerHTML = '';
  boardState = ['', '', '', '', '', '', '', '', ''];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
  restartBtn.style.display = 'inline-block';
}

// Handle cell click event
function handleCellClick(e) {
  const idx = e.target.dataset.index;

  if (!gameActive || boardState[idx] !== '') return;

  boardState[idx] = currentPlayer;
  renderCell(e.target, currentPlayer);

  if (checkWin(currentPlayer)) {
    status.textContent = `${players[currentPlayer].name} wins! 🎉`;
    gameActive = false;
    return;
  }

  if (boardState.every(cell => cell !== '')) {
    status.textContent = "It's a draw! 🤝";
    gameActive = false;
    return;
  }

  currentPlayer = 1 - currentPlayer;
  updateStatus();
}

// Render player logo in clicked cell
function renderCell(cell, playerIdx) {
  cell.textContent = players[playerIdx].logo;
  cell.style.color = playerIdx === 0 ? '#764ba2' : '#f8b500';
}

// Check for a win
function checkWin(playerIdx) {
  return winningCombos.some(combo =>
    combo.every(idx => boardState[idx] === playerIdx)
  );
}

// Update status text
function updateStatus() {
  status.textContent = `${players[currentPlayer].name}'s turn (${players[currentPlayer].logo})`;
}

// Restart game button
restartBtn.addEventListener('click', () => {
  resetBoard();
  gameActive = true;
  currentPlayer = 0;
  updateStatus();
});
