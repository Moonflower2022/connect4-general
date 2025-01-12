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
    constructor(long, height, width) {
        this.long = long
        this.height = height
        this.width = width
    }

    setStartState(height, width) {
        this.long = Long.UZERO
        this.height = height
        this.width = width
    }

    copy() {
        return new Mask(Long.fromValue(this.long), this.height, this.width)
    }

    getPositionLong(y, x) {
        return makeLong(1).shiftLeft(y * this.width + x)
    }

    get(y, x) {
        return this.long.and(this.getPositionLong(y, x))
    }

    flip(y, x) {
        this.long = this.long.xor(this.getPositionLong(y, x))
    }

    setOne(y, x) {
        this.long = this.long.or(this.getPositionLong(y, x))
    }
    
    setZero(y, x) {
        this.long = this.long.and(this.getPositionLong(y, x).not())
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
        return new BitBoard(
            this.p1mask.copy(),
            this.p2mask.copy(),
            this.height,
            this.width
        )
    }

    getMarker(y, x) {
        const p1maskElement = this.p1mask.get(y, x)
        const p2maskElement = this.p2mask.get(y, x)
        if (p1maskElement.equals(Long.UZERO) && p2maskElement.equals(Long.UZERO)) {
            return null
        }
        return p1maskElement.equals(Long.UZERO) ? false : true
    }

    setMarker(y, x, color) {
        if (color === null) {
            throw Error("oaoaooarise")
        }
        if (color === true) {
            if (this.p1mask.get(y, x).equals(this.p1mask.getPositionLong(y, x))) {
                console.warn("eiarnto")
            }
            this.p1mask.flip(y, x)
        } else {
            // color === false
            if (this.p2mask.get(y, x).equals(this.p1mask.getPositionLong(y, x))) {
                console.warn("eiarnto")
            }
            this.p2mask.flip(y, x)
        }
    }

    clear(y, x) {
        if (this.p1mask.get(y, x).equals(this.p1mask.getPositionLong(y, x))) {
            this.p1mask.flip(y, x)
        }
        if (this.p2mask.get(y, x).equals(this.p1mask.getPositionLong(y, x))) {
            this.p2mask.flip(y, x)
        }
    }
}