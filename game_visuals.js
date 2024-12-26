function updateBoard(x) {
    const move = parseInt(x)
    if (game.canPlayMove(move)) {
        game.playMove(move)
        drawConnect4Clickable(game.state.board)
        if (game.getTerminated() && game.getWinner() !== null) {
            drawWinLine(game.state.winningLine)
            return
        }
    }
    // const botMove = minimaxAgent(game)
    const botMove = monteCarloTreeSearchAgent(game)
    game.playMove(botMove)
    drawConnect4Clickable(game.state.board)
    if (game.getTerminated() && game.getWinner() !== null) {
        drawWinLine(game.state.winningLine)
        return
    }
}

function drawConnect4Clickable(board) {
    const gameBoard = document.getElementById("game-board")
    gameBoard.innerHTML = "" 

    for (let row of board) {
        for (let x in row) {
            const cell = row[x]
            const cellDiv = document.createElement("div")
            cellDiv.onclick = () => {
                updateBoard(x)
            }
            cellDiv.classList.add("cell")
            if (cell === true) {
                cellDiv.classList.add("red")
            } else if (cell === false) {
                cellDiv.classList.add("yellow")
            }
            gameBoard.appendChild(cellDiv)
        }
    }
}

function drawConnect4(board) {
    const gameBoard = document.getElementById("game-board")
    gameBoard.innerHTML = "" 

    for (let row of board) {
        for (let x in row) {
            const cell = row[x]
            const cellDiv = document.createElement("div")
            cellDiv.classList.add("cell")
            if (cell === true) {
                cellDiv.classList.add("red")
            } else if (cell === false) {
                cellDiv.classList.add("yellow")
            }
            gameBoard.appendChild(cellDiv)
        }
    }
}