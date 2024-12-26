class MonteCarloTreeSearchConnect4 extends Connect4 {
    constructor(state) {
        super(state)
    }

    setStartState() {
        this.state = {
            board: new Array(this.state.height)
                .fill(null)
                .map(() => new Array(this.state.width).fill(null)),
            turn: true, // default to true for p1 and false for p2
            numPossibleMoves: this.state.width,
            lastMove: null,
            terminated: false,
            winner: null,
            width: 7,
            height: 6,
        }
    }

    copyState() {
        return {
            board: this.state.board.map((row) => [...row]),
            turn: this.state.turn,
            numPossibleMoves: this.state.numPossibleMoves,
            lastMove: this.state.lastMove !== null ? [...this.state.lastMove] : null,
            terminated: this.state.terminated,
            winner: this.state.winner,
            width: this.state.width,
            height: this.state.height,
        }
    }

    playMove(move) {
        let y = this.getY(move)
        this.state.board[y][move] = this.state.turn
        if (y === 0) {
            this.state.numPossibleMoves--
        }
        this.state.turn = !this.state.turn
        this.state.lastMove = [y, move]

        this.state.terminated = this.checkWin()
    }

    checkWin() {
        if (!this.state.lastMove) return false

        const [lastMoveY, lastMoveX] = this.state.lastMove
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
                this.state.winner = this.state.board[center.y][center.x]
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
                this.state.winner = this.state.board[center.y][center.x]
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
                this.state.winner = this.state.board[center.y][center.x]
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
                this.state.winner = this.state.board[center.y][center.x]
                return true
            }
        }

        // Check for draw
        if (this.state.numPossibleMoves === 0) {
            this.state.winner = null
            return true
        }

        return false
    }

    getTerminated() {
        return this.state.terminated
    }

    getWinner() {
        return this.state.winner
    }
}
