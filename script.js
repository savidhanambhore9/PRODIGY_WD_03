const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');
const robotCheckbox = document.getElementById('robot-checkbox');

let isXTurn = true;
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

updateTurnIndicator();

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        if (gameActive && cell.innerText === '') {
            makeMove(cell, isXTurn ? 'X' : 'O');
            if (gameActive && robotCheckbox.checked && !isXTurn) {
                setTimeout(robotMove, 500); // slight delay for better UX
            }
        }
    });
});

restartButton.addEventListener('click', restartGame);

function makeMove(cell, player) {
    cell.innerText = player;
    cell.classList.add(player.toLowerCase());
    board[cell.dataset.index] = player;
    const winnerCombination = checkWinner();
    if (winnerCombination) {
        gameActive = false;
        message.innerText = `${player} WINS!`;
        winnerCombination.forEach(index => {
            cells[index].classList.add(`${player.toLowerCase()}-winner`);
        });
        showModal(`${player} wins!`);
    } else if (board.includes('')) {
        isXTurn = !isXTurn;
        updateTurnIndicator();
    } else {
        gameActive = false;
        message.innerText = 'It\'s a draw!';
        showModal('It\'s a draw!');
    }
}

function checkWinner() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return combination;
        }
    }
    return null;
}

function robotMove() {
    let availableCells = [];
    cells.forEach(cell => {
        if (cell.innerText === '') {
            availableCells.push(cell);
        }
    });

    if (availableCells.length > 0) {
        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
        makeMove(randomCell, 'O');
    }
}

function updateTurnIndicator() {
    cells.forEach(cell => {
        cell.classList.remove('x-turn', 'o-turn');
        if (cell.innerText === '') {
            cell.classList.add(isXTurn ? 'x-turn' : 'o-turn');
        }
    });
}

function restartGame() {
    isXTurn = true;
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('x', 'o', 'x-turn', 'o-turn', 'x-winner', 'o-winner');
    });
    message.innerText = '';
    gameActive = true;
    updateTurnIndicator();
}

function showModal(text) {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modal-content");
    modalContent.innerText = text;
    modal.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("myModal");
    const span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
});
