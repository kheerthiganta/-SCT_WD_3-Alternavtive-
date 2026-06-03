const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("status");

const restartBtn = document.getElementById("restartBtn");

const playerScoreEl =
document.getElementById("playerScore");

const computerScoreEl =
document.getElementById("computerScore");

const pvpBtn =
document.getElementById("pvpBtn");

const aiBtn =
document.getElementById("aiBtn");

/* GAME VARIABLES */

let board =
["","","","","","","","",""];

let currentPlayer = "X";

let gameActive = true;

let gameMode = "pvp";

let playerScore = 0;

let computerScore = 0;

/* WIN PATTERNS */

const winPatterns = [

    [0,1,2],
    [3,4,5],
    [6,7,8],

    [0,3,6],
    [1,4,7],
    [2,5,8],

    [0,4,8],
    [2,4,6]
];

/* MODE BUTTONS */

pvpBtn.addEventListener("click",()=>{

    gameMode = "pvp";

    pvpBtn.classList.add("active");

    aiBtn.classList.remove("active");

    restartGame();
});

aiBtn.addEventListener("click",()=>{

    gameMode = "ai";

    aiBtn.classList.add("active");

    pvpBtn.classList.remove("active");

    restartGame();
});

/* CELL EVENTS */

cells.forEach(cell=>{

    cell.addEventListener("click",handleMove);
});

/* RESTART */

restartBtn.addEventListener("click",restartGame);

/* PLAYER MOVE */

function handleMove(){

    const index = this.dataset.index;

    if(board[index] !== "" || !gameActive){

        return;
    }

    board[index] = currentPlayer;

    this.textContent = currentPlayer;

    if(currentPlayer === "X"){

        this.classList.add("x");

    }else{

        this.classList.add("o");
    }

    /* CHECK WIN */

    if(checkWinner(currentPlayer)){

        if(currentPlayer === "X"){

            playerScore++;

            playerScoreEl.textContent =
            playerScore;

        }else{

            computerScore++;

            computerScoreEl.textContent =
            computerScore;
        }

        statusText.textContent =
        currentPlayer + " Wins!";

        gameActive = false;

        return;
    }

    /* DRAW */

    if(isDraw()){

        statusText.textContent = "Draw!";

        gameActive = false;

        return;
    }

    /* PVP MODE */

    if(gameMode === "pvp"){

        currentPlayer =
        currentPlayer === "X" ? "O" : "X";

        statusText.textContent =
        currentPlayer + "'s Turn";
    }

    /* AI MODE */

    else{

        if(currentPlayer === "X"){

            currentPlayer = "O";

            statusText.textContent =
            "Computer Thinking...";

            setTimeout(computerMove,500);
        }
    }
}

/* COMPUTER MOVE */

function computerMove(){

    let move = findWinningMove("O");

    /* BLOCK PLAYER */

    if(move === -1){

        move = findWinningMove("X");
    }

    /* TAKE CENTER */

    if(move === -1 && board[4] === ""){

        move = 4;
    }

    /* TAKE CORNERS */

    if(move === -1){

        const corners = [0,2,6,8];

        const freeCorners =
        corners.filter(index=>{

            return board[index] === "";
        });

        if(freeCorners.length > 0){

            move =
            freeCorners[
                Math.floor(
                    Math.random()
                    *
                    freeCorners.length
                )
            ];
        }
    }

    /* RANDOM MOVE */

    if(move === -1){

        const available = [];

        board.forEach((cell,index)=>{

            if(cell === ""){

                available.push(index);
            }

        });

        move =
        available[
            Math.floor(
                Math.random()
                *
                available.length
            )
        ];
    }

    board[move] = "O";

    cells[move].textContent = "O";

    cells[move].classList.add("o");

    /* COMPUTER WIN */

    if(checkWinner("O")){

        computerScore++;

        computerScoreEl.textContent =
        computerScore;

        statusText.textContent =
        "Computer Wins!";

        gameActive = false;

        return;
    }

    /* DRAW */

    if(isDraw()){

        statusText.textContent = "Draw!";

        gameActive = false;

        return;
    }

    currentPlayer = "X";

    statusText.textContent = "Your Turn";
}

/* FIND WINNING MOVE */

function findWinningMove(symbol){

    for(let pattern of winPatterns){

        const values =
        pattern.map(index=>board[index]);

        if(

            values.filter(v=>v===symbol).length
            === 2

            &&

            values.includes("")

        ){

            return pattern[
                values.indexOf("")
            ];
        }
    }

    return -1;
}

/* CHECK WINNER */

function checkWinner(player){

    return winPatterns.some(pattern=>{

        return pattern.every(index=>{

            return board[index] === player;
        });

    });
}

/* DRAW */

function isDraw(){

    return board.every(cell=>{

        return cell !== "";
    });
}

/* RESTART */

function restartGame(){

    board =
    ["","","","","","","","",""];

    currentPlayer = "X";

    gameActive = true;

    cells.forEach(cell=>{

        cell.textContent = "";

        cell.classList.remove("x");

        cell.classList.remove("o");
    });

    if(gameMode === "pvp"){

        statusText.textContent =
        "X's Turn";

    }else{

        statusText.textContent =
        "Your Turn";
    }
}