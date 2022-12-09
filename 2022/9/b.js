const fs = require("fs");
const steps = fs
    .readFileSync("./input.txt")
    .toString()
    .split("\n")
    .map((row) => {
        const [direction, stepCount] = row.split(" ");
        return { direction, stepCount };
    });

const rope = new Array(10).fill(null).map(() => ({ x: 0, y: 0 }));

const visited = new Set();

const moveTail = (headIndex = 0) => {
    const tailIndex = headIndex + 1;
    if (!rope[tailIndex]) return;
    const differenceX = rope[headIndex].x - rope[tailIndex].x;
    const differenceY = rope[headIndex].y - rope[tailIndex].y;
    const shouldMoveX = Math.abs(differenceX) > 1;
    const shouldMoveY = Math.abs(differenceY) > 1;
    if (shouldMoveX) {
        rope[tailIndex].x += differenceX > 0 ? 1 : -1;
        if (!shouldMoveY) {
            rope[tailIndex].y = rope[headIndex].y;
        }
    }
    if (shouldMoveY) {
        rope[tailIndex].y += differenceY > 0 ? 1 : -1;
        if (!shouldMoveX) {
            rope[tailIndex].x = rope[headIndex].x;
        }
    }
    moveTail(tailIndex);
    if (tailIndex === 9) {
        visited.add(`${rope[tailIndex].x},${rope[tailIndex].y}`);
    }
};

const moveHead = ({ direction, stepCount }) => {
    const move = {
        R: () => (rope[0].x += 1),
        L: () => (rope[0].x -= 1),
        U: () => (rope[0].y += 1),
        D: () => (rope[0].y -= 1),
    };

    for (let i = 0; i < stepCount; i++) {
        move[direction]();
        moveTail();
    }
};

for (const step of steps) {
    moveHead(step);
}

console.log("🦹‍♂️", visited.size);
