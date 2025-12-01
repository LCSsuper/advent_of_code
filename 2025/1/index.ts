import { input } from "../helpers";

const moves = input("./input.txt")
    .split("\n")
    .map((e) => {
        const direction = e.charAt(0);
        const value = parseInt(e.slice(1), 10);
        return { direction, value };
    });

let currentPos = 50;
let answerA = 0;
let answerB = 0;
for (const move of moves) {
    for (const _ of Array(move.value).fill(0)) {
        if (move.direction === "L") currentPos--;
        if (move.direction === "R") currentPos++;
        if (currentPos < 0) currentPos += 100;
        if (currentPos >= 100) currentPos -= 100;
        if (currentPos === 0) answerB++;
    }

    if (currentPos === 0) {
        answerA++;
    }
}

console.log("Times left at 0:", answerA);
console.log("Times moved past 0:", answerB);
