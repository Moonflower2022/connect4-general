class Connect4 {
    constructor(state) {
        this.state = state
    }

    setStartState() {
        this.state = {
            board: new Array(this.state.height)
                .fill(null)
                .map(() => new Array(this.state.width).fill(null)),
            turn: true, // default to true for p1 and false for p2
            numPossibleMoves: this.state.width,
            pastMoves: [],
            pastTerminateds: [],
            pastWinners: [],
            heights: new Array(this.state.width).fill(0),
            winningLine: null,
            width: 7,
            height: 6,
        }
    }

    getMonteCarloTreeSearchStartState() {
        return {
            board: boardToBitBoard(this.state.board),
            turn: this.state.turn,
            numPossibleMoves: this.state.numPossibleMoves,
            lastMove:
                this.state.pastMoves.length !== 0
                    ? [
                          this.getY(this.state.pastMoves.last()) + 1,
                          this.state.pastMoves.last(),
                      ]
                    : null,
            terminated:
                this.state.pastTerminateds.length !== 0
                    ? this.state.pastTerminateds.last()
                    : false,
            winner:
                this.state.pastWinners.length !== 0
                    ? this.state.pastWinners.last()
                    : null,
            heights: [...this.state.heights],
            width: this.state.width,
            height: this.state.height,
        }
    }

    getMinimaxStartState() {
        return {
            board: boardToBitBoard(this.state.board),
            turn: this.state.turn,
            numPossibleMoves: this.state.numPossibleMoves,
            pastMoves: [...this.state.pastMoves],
            pastTerminateds: [...this.state.pastTerminateds],
            pastWinners: [...this.state.pastWinners],
            heights: [...this.state.heights],
            width: this.state.width,
            height: this.state.height,
        }
    }

    getPossibleMoves() {
        let possibleMoves = []
        for (let x = 0; x < this.state.width; x++) {
            if (this.state.board[0][x] === null) {
                possibleMoves.push(x)
            }
        }
        return possibleMoves
    }

    getNumPossibleMoves() {
        return this.state.numPossibleMoves
    }

    getY(move) {
        return this.state.height - this.state.heights[move] - 1
        // if (this.state.board[0][move] !== null) {
        //     if (this instanceof MonteCarloTreeSearchConnect4) {
        //         console.warn("aorsnetnsro")
        //     }
        //     return -1
        // }
        // for (let y = 0; y < this.state.height; y++) {
        //     if (
        //         y === this.state.height - 1 ||
        //         this.state.board[y + 1][move] !== null
        //     ) {
        //         return y
        //     }
        // }
    }

    canPlayMove(move) {
        return this.state.board[0][move] === null
    }

    playMove(move) {
        let y = this.getY(move)
        if (this.state.board[y] === undefined) {
            const aarste = 1   
        }
        this.state.board[y][move] = this.state.turn
        if (y === 0) {
            this.state.numPossibleMoves--
        }
        this.state.heights[move]++
        this.state.turn = !this.state.turn
        this.state.pastMoves.push(move)

        this.state.pastTerminateds.push(this.checkWin(y))
    }

    checkLine(a, b, c, d) {
        return a !== null && a === b && b === c && c === d
    }

    inBoard(x, y) {
        return x >= 0 && x < this.state.width && y >= 0 && y < this.state.height
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
                this.state.winningLine = [
                    [center.y - i, center.x],
                    [center.y - i + 1, center.x],
                    [center.y - i + 2, center.x],
                    [center.y - i + 3, center.x],
                ]
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
                this.state.winningLine = [
                    [center.y + i, center.x - i],
                    [center.y + i - 1, center.x - i + 1],
                    [center.y + i - 2, center.x - i + 2],
                    [center.y + i - 3, center.x - i + 3],
                ]
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
                this.state.winningLine = [
                    [center.y, center.x - i],
                    [center.y, center.x - i + 1],
                    [center.y, center.x - i + 2],
                    [center.y, center.x - i + 3],
                ]
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
                this.state.winningLine = [
                    [center.y - i, center.x - i],
                    [center.y - i + 1, center.x - i + 1],
                    [center.y - i + 2, center.x - i + 2],
                    [center.y - i + 3, center.x - i + 3],
                ]
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

    getTerminated() {
        return this.state.pastTerminateds.last()
    }

    getWinner() {
        return this.state.pastWinners.last()
    }
}
