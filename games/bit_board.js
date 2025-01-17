function makeLong(number) {
    let high, low
    if (number < 2 ** 32) {
        low = number
        high = 0
    } else {
        low = number % 2 ** 32
        high = Math.floor(number / 2 ** 32) // might be slow
    }
    return new Long(high, low)
}

function maskToBoard(mask) {
    const board = []
    for (let y = 0; y < mask.height; y++) {
        board.push([])
        for (let x = 0; x < mask.width; x++) {
            board[y].push(Long.equal(mask.get(y, x), mask.getPositionLong(y, x)) ? 1 : 0)
        }
    }
    return board
}

class Long {
    static zero = new Long(0, 0)
    static one = new Long(0, 1)

    constructor(high, low) {
        this.high = high
        this.low = low
    }

    copy() {
        return new Long(this.high, this.low)
    }

    static and(long1, long2) {
        return new Long((long1.high & long2.high) >>> 0, (long1.low & long2.low) >>> 0)
    }

    static or(long1, long2) {
        return new Long(
            (long1.high | long2.high) >>> 0,
            (long1.low | long2.low) >>> 0
        )
    }

    static xor(long1, long2) {
        return new Long(
            (long1.high ^ long2.high) >>> 0,
            (long1.low ^ long2.low) >>> 0
        )
    }

    static equal(long1, long2) {
        return long1.high === long2.high && long1.low === long2.low
    }

    not() {
        return new Long(~this.high >>> 0, ~this.low >>> 0)
    }

    shiftLeft(amount) {
        if (amount === 0) {
            return this.copy()
        }
        if (amount >= 32) {
            return new Long((this.low << (amount - 32)) >>> 0, 0)
        } else {
            let high =
                ((this.high << amount) | (this.low >>> (32 - amount))) >>> 0
            let low = (this.low << amount) >>> 0
            return new Long(high, low)
        }
    }

    shiftRight(amount) {
        if (amount === 0) {
            return this.copy()
        }
        if (amount >= 32) {
            return new Long(0, this.high >>> (amount - 32))
        } else {
            let high = this.high >>> amount
            let low =
                ((this.low >>> amount) |
                    ((this.high << (32 - amount)) >>> 0)) >>>
                0
            return new Long(high, low)
        }
    }

    and4(stride) {
        const and3 = Long.and(this, this.shiftRight(stride * 2))
        return Long.and(and3, and3.shiftRight(stride))
    }

    toNumber() {
        return this.high * 2 ** 32 + this.low
    }

    toString() {
        return `0b${this.high.toString(2).padStart(32, "0")}|${this.low
            .toString(2)
            .padStart(32, "0")}`
    }
}

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
        this.long = new Long(0, 0)
        this.height = height
        this.width = width
    }

    copy() {
        return new Mask(this.long.copy(), this.height, this.width)
    }

    getPositionLong(y, x) {
        return Long.one.shiftLeft(y * (this.width + 1) + x)
    }

    get(y, x) {
        return Long.and(this.long, this.getPositionLong(y, x))
    }

    flip(y, x) {
        this.long = Long.xor(this.long, this.getPositionLong(y, x))
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
        if (
            Long.equal(p1maskElement, Long.zero) &&
            Long.equal(p2maskElement, Long.zero)
        ) {
            return null
        }
        return Long.equal(p1maskElement, Long.zero) ? false : true
    }

    setMarker(y, x, color) {
        if (color === null) {
            throw Error("oaoaooarise")
        }
        if (color === true) {
            if (
                Long.equal(
                    this.p1mask.get(y, x),
                    this.p1mask.getPositionLong(y, x)
                )
            ) {
                console.warn("eiarnto")
            }
            this.p1mask.flip(y, x)
        } else {
            // color === false
            if (
                Long.equal(
                    this.p2mask.get(y, x),
                    this.p1mask.getPositionLong(y, x)
                )
            ) {
                console.warn("eiarnto")
            }
            this.p2mask.flip(y, x)
        }
    }

    clear(y, x) {
        if (
            Long.equal(this.p1mask.get(y, x), this.p1mask.getPositionLong(y, x))
        ) {
            this.p1mask.flip(y, x)
        }
        if (
            Long.equal(this.p2mask.get(y, x), this.p1mask.getPositionLong(y, x))
        ) {
            this.p2mask.flip(y, x)
        }
    }
}
