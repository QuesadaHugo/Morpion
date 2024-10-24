const winningBits = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
];

class Bit {
    constructor() {
        this.bits = 0;
    }

    reset() {
        for (let i = 0; i < 9; i++) {
            this.bits &= ~(1 << i);
        }
    }

    set(bit) {
        this.bits |= 1 << bit;
    }

    win() {
        for (let s = 0; s < winningBits.length; s++) {
            let match = true;
            for (let b = 0; b < 3; b++) {
                match = +(this.bits & (1 << (winningBits[s][b]))) != 0;
                if (!match) break;
            }
            if (match) return true;
        }
        return false;
    }

    winningPosition() {
        if(!this.win()) return null;

        for (let s = 0; s < winningBits.length; s++) {
            let match = true;
            for (let b = 0; b < 3; b++) {
                match = +(this.bits & (1 << (winningBits[s][b]))) != 0;
                if (!match) break;
            }
            if(match) {
                return {
                    s: winningBits[s][0],
                    e: winningBits[s][2]
                }
            }
        }
        return null;
    }
}
