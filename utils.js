Object.defineProperty(Array.prototype, "random", {
    value() {
        return this[Math.floor(Math.random() * this.length)]
    },
})

Object.defineProperty(Array.prototype, "last", {
    value() {
        return this[this.length - 1]
    },
})

function drawWinLine(positions) {
    if (!positions || positions.length < 4) return

    // Calculate line properties
    const startPos = positions[0]
    const endPos = positions[positions.length - 1]
    const cellSize = 50 // matches the CSS cell size
    const gap = 5 // matches the CSS gap
    const padding = 10 // matches the CSS padding

    // Create line element
    const line = document.createElement("div")
    line.classList.add("win-line")

    // Calculate line position and dimensions
    const x1 = startPos[1] * (cellSize + gap) + cellSize / 2 + padding
    const y1 = startPos[0] * (cellSize + gap) + cellSize / 2 + padding
    const x2 = endPos[1] * (cellSize + gap) + cellSize / 2 + padding
    const y2 = endPos[0] * (cellSize + gap) + cellSize / 2 + padding

    // Calculate length and angle
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI

    // Apply styles
    line.style.width = `${length}px`
    line.style.left = `${x1}px`
    line.style.top = `${y1}px`
    line.style.transform = `rotate(${angle}deg)`

    // Add line to board
    const gameBoard = document.getElementById("game-board")
    gameBoard.appendChild(line)
}

const explorationConstant = Math.sqrt(2)