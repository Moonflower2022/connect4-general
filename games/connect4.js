function boardToBitBoard(board) {
    const bitBoard = new BitBoard()
    bitBoard.setStartState(board.length, board[0].length)
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[0].length; x++) {
            if (board[y][x] !== null) {
                bitBoard.setMarker(y, x, board[y][x])
            }
        }
    }
    return bitBoard
}

function bitBoardToBoard(bitBoard) {
    const board = []
    for (let y = 0; y < bitBoard.height; y++) {
        board.push([])
        for (let x = 0; x < bitBoard.width; x++) {
            board[y].push(bitBoard.getMarker(y, x))
        }
    }
    return board
}

class Mask {
    constructor(mask, height, width) {
        this.mask = mask
        this.height = height
        this.width = width
    }

    setStartState(height, width) {
        this.mask = BigInt(0)
        this.height = height
        this.width = width
    }

    copy() {
        return new Mask(this.mask, this.height, this.width)
    }

    getPositionMask(y, x) {
        return BigInt(2 ** (y * this.width + x))
    }

    get(y, x) {
        return this.mask & this.getPositionMask(y, x)
    }

    flip(y, x) {
        this.mask ^= this.getPositionMask(y, x)
    }
}

class BitBoard {
    constructor(p1mask, p2mask, height, width) {
        this.p1mask = p1mask
        this.p2mask = p2mask
        this.height = height
        this.width = width
    }

    setStartState(height, width) {
        this.p1mask = new Mask()
        this.p1mask.setStartState(height, width)
        this.p2mask = new Mask()
        this.p2mask.setStartState(height, width)
        this.height = height
        this.width = width
    }

    copy() {
        return new BitBoard(this.p1mask.copy(), this.p2mask.copy(), this.height, this.width)
    }

    getMarker(y, x) {
        const p1maskElement = this.p1mask.get(y, x)
        const p2maskElement = this.p2mask.get(y, x)
        if ((p1maskElement === BigInt(0)) && (p2maskElement === BigInt(0))) {
            return null
        }
        return p1maskElement ? true : false
    }

    setMarker(y, x, color) {
        if (color === true) {
            if (this.p1mask.get(y, x) === BigInt(1)) {
                throw Error("eiarnto")
            }
            this.p1mask.flip(y, x)
        } else {
            // color === false
            if (this.p2mask.get(y, x) === BigInt(1)) {
                throw Error("eiarnto")
            }
            this.p2mask.flip(y, x)
        }
    }
}

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
            width: this.state.width,
            height: this.state.height,
        }
    }

    getMinimaxStartState() {
        return {
            board: getBitBoardFromBoard(this.state.board),
            turn: this.state.turn,
            numPossibleMoves: this.state.numPossibleMoves,
            pastMoves: [...this.state.pastMoves],
            pastTerminateds: [...this.state.pastTerminateds],
            pastWinners: [...this.state.pastWinners],
            terminated: this.state.terminated,
            winner: this.state.winner,
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
        if (this.state.board[0][move] !== null) {
            if (this instanceof MonteCarloTreeSearchConnect4) {
                console.warn("aorsnetnsro")
            }
            return -1
        }
        for (let y = 0; y < this.state.height; y++) {
            if (
                y === this.state.height - 1 ||
                this.state.board[y + 1][move] !== null
            ) {
                return y
            }
        }
    }

    canPlayMove(move) {
        return this.state.board[0][move] === null
    }

    playMove(move) {
        let y = this.getY(move)
        this.state.board[y][move] = this.state.turn
        if (y === 0) {
            this.state.numPossibleMoves--
        }
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
