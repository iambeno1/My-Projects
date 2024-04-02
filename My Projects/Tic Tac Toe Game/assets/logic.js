const box = document.querySelectorAll('.box');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modalMessage');
const modalClose = document.querySelector('.close');

let currentPlayer = 'O';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;

function evaluate(board) {
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combo of winCombinations) {
    const [a, b, c] = combo;
    if (board[a] === 'X' && board[b] === 'X' && board[c] === 'X') {
      return 10;
    }
  }

  for (const combo of winCombinations) {
    const [a, b, c] = combo;
    if (board[a] === 'O' && board[b] === 'O' && board[c] === 'O') {
      return -10;
    }
  }

  return 0;
}

function minimax(board, depth, isMaximizing) {
  const score = evaluate(board);

  if (score === 10 || score === -10) {
    return score;
  }

  if (board.indexOf('') === -1) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
        board[i] = '';
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
        board[i] = '';
      }
    }
    return bestScore;
  }
}

function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < gameBoard.length; i++) {
    if (gameBoard[i] === '') {
      gameBoard[i] = 'X';
      let score = minimax(gameBoard, 0, false);
      gameBoard[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function checkWinner() {
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combo of winCombinations) {
    const [a, b, c] = combo;
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      gameOver = true;
      message.innerText = `${gameBoard[a]} wins!`;
      // Menambahkan efek confetti hanya jika pemain 'O' menang
      if (gameBoard[a] === 'O') {
        const jsConfetti = new JSConfetti();
        jsConfetti.addConfetti();
      }

      showModal(`${gameBoard[a]} wins!`);
      return;
    }
  }

  if (!gameBoard.includes('')) {
    gameOver = true;
    message.innerText = "It's a draw!";
    showModal("It's a draw!");

    return;
  }
}

function makeMove(index) {
  if (!gameBoard[index] && !gameOver) {
    gameBoard[index] = currentPlayer;
    box[index].textContent = currentPlayer;
    currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
    checkWinner();
    if (!gameOver && currentPlayer === 'X') {
      const index = bestMove();
      makeMove(index);
    }
  }
}

for (let i = 0; i < box.length; i++) {
  box[i].addEventListener('click', () => {
    makeMove(i);
  });
}

restartBtn.addEventListener('click', () => {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  gameOver = false;
  currentPlayer = 'O';
  message.innerText = '';
  box.forEach((box) => (box.textContent = ''));
  closeModal();
});

function showModal(text) {
  modalMessage.textContent = text;
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
}

modalClose.addEventListener('click', closeModal);

window.addEventListener('click', (event) => {
  if (event.target == modal) {
    closeModal();
  }
});

// Change Background Color
const colors = ['#374b5c', '#375c5a', '#585c37', '#5c4337', '#5c374b', '#57375c', '#57375c', '#373a5c'];

function changeBackgroundColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  document.body.style.backgroundColor = colors[randomIndex];
}

document.getElementById('changeColorButton').addEventListener('click', changeBackgroundColor);

// Play Sound
const musicButton = document.getElementById('btn--music');
const audio = document.getElementById('music');

musicButton.addEventListener('click', function () {
  const icon = musicButton.querySelector('i');

  // Toggle kelas ikon
  if (icon.classList.contains('ri-volume-mute-line')) {
    // Jika sedang dalam mode non-mute, ubah menjadi mode mute
    icon.classList.remove('ri-volume-mute-line');
    icon.classList.add('ri-music-2-line');
    // Putar musik
    audio.play();
  } else {
    // Jika sedang dalam mode mute, ubah menjadi mode non-mute
    icon.classList.remove('ri-music-2-line');
    icon.classList.add('ri-volume-mute-line');
    // Hentikan musik
    audio.pause();
  }
});
