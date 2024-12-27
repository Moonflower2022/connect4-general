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

