// script.js
document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const resetButton = document.getElementById('reset');
    const resetScoresButton = document.getElementById('reset-scores');
    const currentPlayerDisplay = document.getElementById('current-player');
    const message = document.getElementById('message');
    const player1ScoreDisplay = document.getElementById('player1-score');
    const player2ScoreDisplay = document.getElementById('player2-score');
    const boardSizeSelect = document.getElementById('board-size');

    let currentPlayer = 'X';
    let gameBoard = Array(9).fill('');
    let isGameActive = true;
    let player1Score = localStorage.getItem('player1Score') || 0;
    let player2Score = localStorage.getItem('player2Score') || 0;
    let boardSize = 3; // Default board size is 3x3

    const winningConditions = (size) => {
        let conditions = [];

        // Rows
        for (let i = 0; i < size; i++) {
            conditions.push(Array.from({ length: size }, (_, k) => i * size + k));
        }

        // Columns
        for (let i = 0; i < size; i++) {
            conditions.push(Array.from({ length: size }, (_, k) => i + k * size));
        }

        // Diagonals
        conditions.push(Array.from({ length: size }, (_, k) => k * (size + 1)));
        conditions.push(Array.from({ length: size }, (_, k) => (k + 1) * (size - 1)));

        return conditions;
    };

    player1ScoreDisplay.textContent = player1Score;
    player2ScoreDisplay.textContent = player2Score;

    const createBoard = (size) => {
        board.innerHTML = '';
        board.style.gridTemplateColumns = `repeat(${size}, 100px)`;
        gameBoard = Array(size * size).fill('');
        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
        isGameActive = true;
        currentPlayer = 'X';
        currentPlayerDisplay.textContent = currentPlayer;
        message.textContent = '';
    };

    const handleCellClick = (e) => {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameBoard[clickedCellIndex] !== '' || !isGameActive) {
            return;
        }

        gameBoard[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;

        checkWinner();
    };

    const checkWinner = () => {
        let winConditions = winningConditions(boardSize);
        let roundWon = false;

        for (let i = 0; i < winConditions.length; i++) {
            const winCondition = winConditions[i];
            const firstSymbol = gameBoard[winCondition[0]];
            if (firstSymbol === '') continue;

            let winningLine = winCondition.every(index => gameBoard[index] === firstSymbol);
            if (winningLine) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            message.textContent = `Player ${currentPlayer} has won!`;
            updateScores();
            isGameActive = false;
            setTimeout(() => createBoard(boardSize), 5000);
            return;
        }

        if (!gameBoard.includes('')) {
            message.textContent = 'Game is a draw!';
            isGameActive = false;
            setTimeout(() => createBoard(boardSize), 5000);
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        currentPlayerDisplay.textContent = currentPlayer;
    };

    const updateScores = () => {
        if (currentPlayer === 'X') {
            player1Score++;
        } else {
            player2Score++;
        }
        localStorage.setItem('player1Score', player1Score);
        localStorage.setItem('player2Score', player2Score);
        player1ScoreDisplay.textContent = player1Score;
        player2ScoreDisplay.textContent = player2Score;
    };

    const resetGame = () => {
        createBoard(boardSize);
    };

    const resetScores = () => {
        player1Score = 0;
        player2Score = 0;
        localStorage.setItem('player1Score', 0);
        localStorage.setItem('player2Score', 0);
        player1ScoreDisplay.textContent = 0;
        player2ScoreDisplay.textContent = 0;
    };

    resetButton.addEventListener('click', resetGame);
    resetScoresButton.addEventListener('click', resetScores);

    // Handle board size change (if needed)
    boardSizeSelect.addEventListener('change', (e) => {
        boardSize = parseInt(e.target.value);
        createBoard(boardSize);
    });

    // Initialize the board with default size
    createBoard(boardSize);
});
