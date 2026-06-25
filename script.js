const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const playerScoreEl = document.getElementById("playerScore");
const computerScoreEl = document.getElementById("computerScore");
const drawScoreEl = document.getElementById("drawScore");
const pvpBtn = document.getElementById("pvpBtn");
const aiBtn = document.getElementById("aiBtn");
const difficultySelect = document.getElementById("difficultySelect");
const starterSelect = document.getElementById("starterSelect");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let gameMode = "pvp";
let difficulty = "medium";
let starter = "X";
let playerScore = 0;
let opponentScore = 0;
let drawScore = 0;

const displayMarks = {
    X: "X",
    O: "O"
};

const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

pvpBtn.addEventListener("click", () => {
    setMode("pvp");
});

aiBtn.addEventListener("click", () => {
    setMode("ai");
});

difficultySelect.addEventListener("change", () => {
    difficulty = difficultySelect.value;
    restartGame();
});

starterSelect.addEventListener("change", () => {
    starter = starterSelect.value;
    restartGame();
});

restartBtn.addEventListener("click", restartGame);
resetScoreBtn.addEventListener("click", resetScores);

cells.forEach((cell) => {
    cell.addEventListener("click", handleMove);
});

function setMode(mode) {
    gameMode = mode;
    pvpBtn.classList.toggle("active", mode === "pvp");
    aiBtn.classList.toggle("active", mode === "ai");
    updateScoreLabels();
    restartGame();
}

function handleMove() {
    const index = Number(this.dataset.index);

    if (board[index] !== "" || !gameActive) {
        return;
    }

    if (gameMode === "ai" && currentPlayer === "O") {
        return;
    }

    placeMove(index, currentPlayer);
    finishTurn();
}

function placeMove(index, player) {
    board[index] = player;
    cells[index].textContent = displayMarks[player];
    cells[index].classList.add(player.toLowerCase());
}

function finishTurn() {
    const winner = getWinningPattern(currentPlayer);

    if (winner) {
        recordWin(currentPlayer, winner);
        return;
    }

    if (isDraw()) {
        drawScore++;
        drawScoreEl.textContent = drawScore;
        statusText.textContent = "It's a Draw";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();

    if (gameMode === "ai" && currentPlayer === "O") {
        gameActive = false;
        setTimeout(computerMove, 450);
    }
}

function computerMove() {
    const move = getComputerMove();
    placeMove(move, "O");
    gameActive = true;
    finishTurn();
}

function getComputerMove() {
    if (difficulty === "easy") {
        return getRandomMove();
    }

    if (difficulty === "medium") {
        return getSmartMove();
    }

    return getBestMove();
}

function getSmartMove() {
    return findWinningMove("O")
        ?? findWinningMove("X")
        ?? getPreferredMove()
        ?? getRandomMove();
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = -1;

    getAvailableMoves().forEach((move) => {
        board[move] = "O";
        const score = minimax(false);
        board[move] = "";

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    });

    return bestMove;
}

function minimax(isMaximizing) {
    if (getWinningPattern("O")) {
        return 10;
    }

    if (getWinningPattern("X")) {
        return -10;
    }

    if (isDraw()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;

        getAvailableMoves().forEach((move) => {
            board[move] = "O";
            bestScore = Math.max(bestScore, minimax(false));
            board[move] = "";
        });

        return bestScore;
    }

    let bestScore = Infinity;

    getAvailableMoves().forEach((move) => {
        board[move] = "X";
        bestScore = Math.min(bestScore, minimax(true));
        board[move] = "";
    });

    return bestScore;
}

function findWinningMove(symbol) {
    for (const pattern of winPatterns) {
        const values = pattern.map((index) => board[index]);
        const matchingCells = values.filter((value) => value === symbol).length;

        if (matchingCells === 2 && values.includes("")) {
            return pattern[values.indexOf("")];
        }
    }

    return null;
}

function getPreferredMove() {
    if (board[4] === "") {
        return 4;
    }

    const corners = [0, 2, 6, 8].filter((index) => board[index] === "");

    if (corners.length > 0) {
        return corners[Math.floor(Math.random() * corners.length)];
    }

    return null;
}

function getRandomMove() {
    const available = getAvailableMoves();
    return available[Math.floor(Math.random() * available.length)];
}

function getAvailableMoves() {
    return board
        .map((value, index) => value === "" ? index : null)
        .filter((index) => index !== null);
}

function getWinningPattern(player) {
    return winPatterns.find((pattern) => {
        return pattern.every((index) => board[index] === player);
    });
}

function recordWin(player, pattern) {
    pattern.forEach((index) => {
        cells[index].classList.add("winning");
    });

    if (player === "X") {
        playerScore++;
        playerScoreEl.textContent = playerScore;
        statusText.textContent = "Player X Wins";
    } else {
        opponentScore++;
        computerScoreEl.textContent = opponentScore;
        statusText.textContent = gameMode === "ai" ? "Computer Wins" : "Player O Wins";
    }

    gameActive = false;
}

function isDraw() {
    return board.every((cell) => cell !== "");
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = getStartingPlayer();
    gameActive = true;

    cells.forEach((cell) => {
        cell.textContent = "";
        cell.classList.remove("x", "o", "winning");
    });

    updateStatus();

    if (gameMode === "ai" && currentPlayer === "O") {
        gameActive = false;
        setTimeout(computerMove, 450);
    }
}

function getStartingPlayer() {
    if (starter === "random") {
        return Math.random() > 0.5 ? "X" : "O";
    }

    return starter;
}

function updateStatus() {
    if (gameMode === "ai") {
        statusText.textContent = currentPlayer === "X" ? "Your Turn" : "Computer's Turn";
        return;
    }

    statusText.textContent = currentPlayer === "X" ? "Player X's Turn" : "Player O's Turn";
}

function resetScores() {
    playerScore = 0;
    opponentScore = 0;
    drawScore = 0;
    playerScoreEl.textContent = "0";
    computerScoreEl.textContent = "0";
    drawScoreEl.textContent = "0";
    restartGame();
}

function updateScoreLabels() {
    const scoreLabels = document.querySelectorAll(".score-box h3");
    scoreLabels[0].textContent = "Player X";
    scoreLabels[1].textContent = gameMode === "ai" ? "Computer" : "Player O";
}

updateScoreLabels();
