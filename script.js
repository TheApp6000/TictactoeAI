const cells = document.querySelectorAll('[data-cell]');
const xScore = document.getElementById('x-score');
const oScore = document.getElementById('o-score');
const drawsDisplay = document.getElementById('draws-score');
const resetButton = document.getElementById('reset-button');
const gridCells = document.querySelectorAll('.cell');
const playerXSound = document.getElementById('playerXSound');
const playerOSound = document.getElementById('playerOSound');
const winSoundX = document.getElementById('winSoundX');
const winSoundO = document.getElementById('winSoundO');
const drawSound = document.getElementById('drawSound');
const soundControl = document.getElementById('sound-control');
const muteButton = document.getElementById('unmute-sound');
const unmuteButton = document.getElementById('mute-sound');

let currentPlayer = 'X';
let xScoreValue = 0;
let oScoreValue = 0;
let drawsValue = 0;
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

playerXSound.volume = 1.0;

function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (gameBoard[cellIndex] === '' && gameActive && currentPlayer === 'X') {
        makeMove(cellIndex, currentPlayer);
        playerXSound.play();
    } else if (gameBoard[cellIndex] === '' && gameActive && currentPlayer === 'O') {
        makeMove(cellIndex, currentPlayer);
        playerOSound.play();
    }
}

function makeMove(cellIndex, player) {
    gameBoard[cellIndex] = player;
    cells[cellIndex].textContent = player;
    cells[cellIndex].style.color = player === 'X' ? '#ff5733' : '#77dd77';
    checkResult();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (gameActive && currentPlayer === 'O') {
        setTimeout(makeAIMove, 500);
    }
}

function makeAIMove() {
    let bestMove = -Infinity;
    let move;

    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            const score = minimax(gameBoard, 0, false, -Infinity, Infinity);
            gameBoard[i] = '';

            if (score > bestMove) {
                bestMove = score;
                move = i;
            }
        }
    }

    makeMove(move, 'O');
}

function checkResult() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            endGame(true);
            return;
        }
    }

    if (!gameBoard.includes('')) {
        endGame(false);
    }
}

function endGame(isWinner) {
    gameActive = false;
    if (isWinner) {
        if (currentPlayer === 'X') {
            xScoreValue++;
            xScore.textContent = xScoreValue;
            showModal('Player X wins!');
            winSoundX.play();
        } else {
            oScoreValue++;
            oScore.textContent = oScoreValue;
            showModal('Player O wins!');
            winSoundO.play();
        }
    } else {
        drawsValue++;
        drawsDisplay.textContent = drawsValue;
        showModal("It's a draw!");
        drawSound.play();
    }
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.color = '#000';
    });
    currentPlayer = 'X';
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);

function evaluateBoard() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            if (gameBoard[a] === 'X') {
                return -1;
            } else if (gameBoard[a] === 'O') {
                return 1;
            }
        }
    }

    if (!gameBoard.includes('')) {
        return 0;
    }

    return null;
}

function minimax(board, depth, isMaximizingPlayer, alpha, beta) {
    const score = evaluateBoard();

    if (score !== null) {
        return score;
    }

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                const eval = minimax(board, depth + 1, false, alpha, beta);
                board[i] = '';
                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                const eval = minimax(board, depth + 1, true, alpha, beta);
                board[i] = '';
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return minEval;
    }
}

function showModal(message) {
    const modal = document.getElementById('win-modal');
    const winMessage = document.getElementById('win-message');
    const closeModal = document.getElementById('close-modal');

    winMessage.textContent = message;
    modal.style.display = 'flex';

    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });
}

muteButton.addEventListener('click', () => {
    // Mute the sound
    playerXSound.volume = 0;
    playerOSound.volume = 0;
    winSoundX.volume = 0;
    winSoundO.volume = 0;
    drawSound.volume = 0;
    muteButton.style.display = 'none';
    unmuteButton.style.display = 'inline-block'; // Display unmute button
});

unmuteButton.addEventListener('click', () => {
    // Unmute the sound
    playerXSound.volume = 1.0;
    playerOSound.volume = 1.0;
    winSoundX.volume = 1.0;
    winSoundO.volume = 1.0;
    drawSound.volume = 1.0;
    unmuteButton.style.display = 'none';
    muteButton.style.display = 'inline-block'; // Display mute button
});
