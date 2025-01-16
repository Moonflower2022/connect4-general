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
