class MonteCarloTreeSearchConnect4 extends Connect4 {
    constructor(state) {
        super(state)
    }

    copy() {
        return new MonteCarloTreeSearchConnect4({
            board: this.state.board.copy(),
            turn: this.state.turn,
            numPossibleMoves: this.state.numPossibleMoves,
            lastMove: this.state.lastMove !== null ? [...this.state.lastMove] : null,
            terminated: this.state.terminated,
            winner: this.state.winner,
            width: this.state.width,
            height: this.state.height,
        })
    }

    getPossibleMoves() {
        let possibleMoves = []
        for (let x = 0; x < this.state.width; x++) {
            if (this.state.board.getMarker(0, x) === null) {
                possibleMoves.push(x)
            }
        }
        return possibleMoves
    }

    getY(move) {
        if (this.state.board.getMarker(0, move) !== null) {
            if (this instanceof MonteCarloTreeSearchConnect4) {
                console.warn("aorsnetnsro")
            }
            return -1
        }
        for (let y = 0; y < this.state.height; y++) {
            if (
                y === this.state.height - 1 ||
                this.state.board.getMarker(y + 1, move) !== null
            ) {
                return y
            }
        }
    }

    playMove(move) {
        let y = this.getY(move)
        this.state.board.setMarker(y, move, this.state.turn)
        if (y === 0) {
            this.state.numPossibleMoves--
        }
        this.state.lastMove = [y, move]
        
        this.state.terminated = this.checkWinNew()

        if (this.state.terminated) {
            if (this.state.numPossibleMoves !== 0) {
                this.state.winner = this.state.turn
            }
        }

        this.state.turn = !this.state.turn
    }

    checkConnect4() {
        const relevantLong = this.state.turn ? this.state.board.p1mask.long : this.state.board.p2mask.long

        const horizontalWin = !Long.equal(relevantLong.and4(1), Long.zero)
        const verticalWin = !Long.equal(relevantLong.and4(this.state.width),Long.zero)
        const diagonalPositiveSlopeWin = !Long.equal(relevantLong.and4(this.state.width - 1), Long.zero)
        const diagonalNegativeSlopeWin = !Long.equal(relevantLong.and4(this.state.width + 1), Long.zero)
        return horizontalWin || verticalWin || diagonalPositiveSlopeWin || diagonalNegativeSlopeWin
    }

    checkWinNew() {
        if (this.checkConnect4()) {
            this.state.winner = this.state.turn
            return true
        }
        if (this.state.numPossibleMoves === 0) {
            return true
        }
        return false
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

