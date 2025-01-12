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
        return new Long(long1.high & long2.high, long1.low & long2.low)
    }

    static or(long1, long2) {
        return new Long((long1.high | long2.high) >>> 0, (long1.low | long2.low) >>> 0)
    }

    static xor(long1, long2) {
        return new Long((long1.high ^ long2.high) >>> 0, (long1.low ^ long2.low) >>> 0)
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
        return this.high * (2 ** 32) + this.low
    }

    toString() {
        return `0b${this.high.toString(2).padStart(32, "0")}|${this.low
            .toString(2)
            .padStart(32, "0")}`
    }
}