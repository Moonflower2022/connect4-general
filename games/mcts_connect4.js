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
            heights: [...this.state.heights],
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

    playMove(move) {
        let y = this.getY(move)
        this.state.board.setMarker(y, move, this.state.turn)
        if (y === 0) {
            this.state.numPossibleMoves--
        }
        this.state.lastMove = [y, move]
        this.state.heights[move]++
        
        this.state.terminated = this.checkWin()

        if (this.state.terminated && this.state.numPossibleMoves !== 0) {
            this.state.winner = this.state.turn
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

    checkWin() {
        if (this.checkConnect4()) {
            this.state.winner = this.state.turn
            return true
        }
        if (this.state.numPossibleMoves === 0) {
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

