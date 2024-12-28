function drawWinLine(positions) {
    const startPos = positions[0]
    const endPos = positions[positions.length - 1]
    const cellSize = 50 // matches the CSS cell size
    const gap = 5 // matches the CSS gap
    const padding = 10 // matches the CSS padding

    const line = document.createElement("div")
    line.classList.add("win-line")

    const x1 = startPos[1] * (cellSize + gap) + cellSize / 2 + padding
    const y1 = startPos[0] * (cellSize + gap) + cellSize / 2 + padding
    const x2 = endPos[1] * (cellSize + gap) + cellSize / 2 + padding
    const y2 = endPos[0] * (cellSize + gap) + cellSize / 2 + padding

    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI

    line.style.width = `${length}px`
    line.style.left = `${x1}px`
    line.style.top = `${y1}px`
    line.style.transform = `rotate(${angle}deg)`

    const gameBoard = document.getElementById("game-board")
    gameBoard.appendChild(line)
}

function drawConnect4(
    board,
    hoverEffect = true,
    onclick = false,
    lastPlayedP1 = false,
    lastPlayedP2 = false
) {
    const gameBoard = document.getElementById("game-board")
    gameBoard.innerHTML = ""

    for (let y in board) {
        row = board[y]
        for (let x in row) {
            const cell = row[x]
            const cellDiv = document.createElement("div")
            if (hoverEffect && cell === null) {
                cellDiv.classList.add("hover-effect")
            }
            if (onclick && cell === null) {
                cellDiv.onclick = () => {
                    onclick(x)
                }
            }
            cellDiv.classList.add("cell")
            if (cell === true) {
                cellDiv.classList.add("red")
            } else if (cell === false) {
                cellDiv.classList.add("yellow")
            }
            if (y === lastPlayedP1[0] && x === lastPlayedP1[1]) {
                cellDiv.classList.add("p1-last-played")
            } else if (y === lastPlayedP2[0] && x === lastPlayedP2[1]) {
                cellDiv.classList.add("p2-last-played")
            }
            gameBoard.appendChild(cellDiv)
        }
    }
}
