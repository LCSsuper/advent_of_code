const fs = require("fs");
const steps = fs
    .readFileSync("./input.txt")
    .toString()
    .split("\n")
    .map((row) => {
        const [direction, stepCount] = row.split(" ");
        return { direction, stepCount };
    });

const head = { x: 0, y: 0 };
const tail = { x: 0, y: 0 };

const visited = new Set();

const moveTail = () => {
    const differenceX = head.x - tail.x;
    const differenceY = head.y - tail.y;
    if (Math.abs(differenceX) > 1) {
        tail.x += differenceX > 0 ? 1 : -1;
        tail.y = head.y;
    }
    if (Math.abs(differenceY) > 1) {
        tail.y += differenceY > 0 ? 1 : -1;
        tail.x = head.x;
    }
    // console.log("HEAD", head);
    // console.log("TAIL", tail);
    visited.add(`${tail.x},${tail.y}`);
};

const moveHead = ({ direction, stepCount }) => {
    // console.log("--------------------");
    // console.log(`MOVE: ${direction} ${stepCount}`);
    const move = {
        R: () => (head.x += 1),
        L: () => (head.x -= 1),
        U: () => (head.y += 1),
        D: () => (head.y -= 1),
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
