let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameMode = '';

document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => square.addEventListener('click', () => makeMove(square)));

    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', resetGame);

    const vsAIButton = document.getElementById('vs-ai-button');
    vsAIButton.addEventListener('click', () => startGame('vsAI'));

    const twoPlayerButton = document.getElementById('two-player-button');
    twoPlayerButton.addEventListener('click', () => startGame('twoPlayer'));
});

function startGame(mode) {
    gameMode = mode;
    resetGame();
}

function makeMove(square) {
    const index = square.id;
    if (board[index] || document.getElementById("result").textContent !== "") return;

    board[index] = currentPlayer;
    renderSquare(square, currentPlayer);

    if (checkWin(currentPlayer)) {
        document.getElementById("result").textContent = `Player ${currentPlayer} wins!`;
    } else if (isBoardFull()) {
        document.getElementById("result").textContent = "It's a tie!";
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (gameMode === 'vsAI' && currentPlayer === 'O') {
            setTimeout(makeAIMove, 500);
        }
    }
}

function makeAIMove() {
    const bestMove = getBestMove();
    const square = document.getElementById(bestMove.index);
    board[bestMove.index] = currentPlayer;
    renderSquare(square, currentPlayer);

    if (checkWin(currentPlayer)) {
        document.getElementById("result").textContent = `Player ${currentPlayer} wins!`;
    } else if (isBoardFull()) {
        document.getElementById("result").textContent = "It's a tie!";
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function renderSquare(square, value) {
    square.textContent = value;
    square.classList.add('filled');
}

function checkWin(player) {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];
    return winningCombos.some(combo => {
        return combo.every(index => board[index] === player);
    });
}

function isBoardFull() {
    return board.every(square => square !== '');
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = {index: i, score: score};
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin('X')) {
        return -10 + depth;
    } else if (checkWin('O')) {
        return 10 - depth;
    } else if (isBoardFull()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    document.getElementById("result").textContent = "";
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.textContent = "";
        square.classList.remove('filled');
    });
}
