class MinimaxConnect4 extends Connect4 {
    constructor(state) {
        super(state)
    }

    undoMove() {
        const move = this.state.pastMoves.last()
        let y = this.getY(move) + 1
        this.state.board[y][move] = null
        if (y === 0) {
            this.state.numPossibleMoves++
        }
        this.state.turn = !this.state.turn
        this.state.pastMoves.pop()
        this.state.pastTerminateds.pop()
        this.state.pastWinners.pop()
    }

    checkWin(y) {
        if (this.state.pastMoves.length === 0) return false

        const lastMoveX = this.state.pastMoves.last()
        const lastMoveY = y
        const center = {
            x: lastMoveX,
            y: lastMoveY,
        }

        // Vertical check
        for (let i = 0; i < 4; i++) {
            if (
                this.inBoard(center.x, center.y - i) &&
                this.inBoard(center.x, center.y - i + 3) &&
                this.checkLine(
                    this.state.board[center.y - i][center.x],
                    this.state.board[center.y - i + 1][center.x],
                    this.state.board[center.y - i + 2][center.x],
                    this.state.board[center.y - i + 3][center.x]
                )
            ) {
                this.state.pastWinners.push(
                    this.state.board[center.y][center.x]
                )
                return true
            }
        }

        // Diagonal (negative slope)
        for (let i = 0; i < 4; i++) {
            if (
                this.inBoard(center.x - i, center.y + i) &&
                this.inBoard(center.x - i + 3, center.y + i - 3) &&
                this.checkLine(
                    this.state.board[center.y + i][center.x - i],
                    this.state.board[center.y + i - 1][center.x - i + 1],
                    this.state.board[center.y + i - 2][center.x - i + 2],
                    this.state.board[center.y + i - 3][center.x - i + 3]
                )
            ) {
                this.state.pastWinners.push(
                    this.state.board[center.y][center.x]
                )
                return true
            }
        }

        // Horizontal check
        for (let i = 0; i < 4; i++) {
            if (
                this.inBoard(center.x - i, center.y) &&
                this.inBoard(center.x - i + 3, center.y) &&
                this.checkLine(
                    this.state.board[center.y][center.x - i],
                    this.state.board[center.y][center.x - i + 1],
                    this.state.board[center.y][center.x - i + 2],
                    this.state.board[center.y][center.x - i + 3]
                )
            ) {
                this.state.pastWinners.push(
                    this.state.board[center.y][center.x]
                )
                return true
            }
        }

        // Diagonal (positive slope)
        for (let i = 0; i < 4; i++) {
            if (
                this.inBoard(center.x - i, center.y - i) &&
                this.inBoard(center.x - i + 3, center.y - i + 3) &&
                this.checkLine(
                    this.state.board[center.y - i][center.x - i],
                    this.state.board[center.y - i + 1][center.x - i + 1],
                    this.state.board[center.y - i + 2][center.x - i + 2],
                    this.state.board[center.y - i + 3][center.x - i + 3]
                )
            ) {
                this.state.pastWinners.push(
                    this.state.board[center.y][center.x]
                )
                return true
            }
        }

        this.state.pastWinners.push(null)

        // Check for draw
        if (this.state.numPossibleMoves === 0) {
            return true
        }

        return false
    }
}
