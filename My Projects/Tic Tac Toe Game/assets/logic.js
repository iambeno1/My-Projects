const box = document.querySelectorAll('.box');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modalMessage');
const modalClose = document.querySelector('.close');

let currentPlayer = 'O';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;

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
  }
}

function makeMove(index) {
  if (!gameBoard[index] && !gameOver) {
    gameBoard[index] = currentPlayer;
    box[index].textContent = currentPlayer;
    currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
    checkWinner();
  }
}

for (let i = 0; i < box.length; i++) {
  box[i].addEventListener('click', () => {
    makeMove(i);

    // buat AI bermain di tempat random
    if (!gameOver && currentPlayer === 'X') {
      const emptyBox = gameBoard.reduce((acc, value, index) => {
        if (!value) acc.push(index);
        return acc;
      }, []);
      const randomIndex = emptyBox[Math.floor(Math.random() * emptyBox.length)];
      makeMove(randomIndex);
    }
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
