function hasGaps(board) {
    for (let x = 0; x < board[0].length; x++) {
        let seenNonNull = false
        for (let y = 0; y < board.length; y++) {
            if (board[y][x] === null) {
                if (seenNonNull) {
                    return true
                }
            } else {
                seenNonNull = true
            }
        }
    }
    return false
}

Object.defineProperty(Long.prototype, "and4", {
    value(stride) {
        const and3 = this.and(this.shiftRight(stride * 2))
        return and3.and(and3.shiftRight(stride))
    },
})

function makeLong(number) {
    // let high, low
    // if (number < 2 ** 32) {
    //     low = number
    //     high = 0
    // } else {
    //     low = number % 2 ** 32
    //     high = Math.floor(number / 2 ** 32) // might be slow
    // }
    // return new Long(high, low)
    const long = new Long(number)
    long.unsigned = true
    return long
}

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
