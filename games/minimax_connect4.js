class MinimaxConnect4 extends Connect4 {
    constructor(state) {
        super(state)
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
        this.state.heights[move]++

        this.state.pastMoves.push(move)
        this.state.pastTerminateds.push(
            this.checkConnect4() || this.state.numPossibleMoves === 0
        )

        if (this.getTerminated() && this.state.numPossibleMoves !== 0) {
            this.state.pastWinners.push(this.state.turn)
        } else {
            this.state.pastWinners.push(null)
        }

        this.state.turn = !this.state.turn
    }

    undoMove() {
        const move = this.state.pastMoves.last()
        const y = this.getY(move) + 1
        this.state.board.clear(y, move)
        if (y === 0) {
            this.state.numPossibleMoves++
        }
        this.state.heights[move]--
        this.state.turn = !this.state.turn
        this.state.pastMoves.pop()
        this.state.pastTerminateds.pop()
        this.state.pastWinners.pop()
    }

    checkConnect4() {
        const relevantLong = this.state.turn
            ? this.state.board.p1mask.long
            : this.state.board.p2mask.long

        const horizontalWin = !relevantLong.and4(1).equals(Long.UZERO)
        const verticalWin = !relevantLong.and4(this.state.width).equals(Long.UZERO)
        const diagonalPositiveSlopeWin = !relevantLong.and4(this.state.width - 1).equals(Long.UZERO)
        const diagonalNegativeSlopeWin = !relevantLong.and4(this.state.width + 1).equals(Long.UZERO)
        return (
            horizontalWin ||
            verticalWin ||
            diagonalPositiveSlopeWin ||
            diagonalNegativeSlopeWin
        )
    }
}
