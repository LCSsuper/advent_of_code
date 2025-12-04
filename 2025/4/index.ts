import { input } from "../helpers";

let map = input("./input.txt")
    .split("\n")
    .map((line) => line.split(""));

const check = (pos: { x: number; y: number }): boolean => {
    let rolls = 0;
    for (let x = pos.x - 1; x <= pos.x + 1; x++) {
        for (let y = pos.y - 1; y <= pos.y + 1; y++) {
            if (x === pos.x && y === pos.y) continue;
            if (map[y]?.[x] === "@") rolls++;
        }
    }
    return rolls < 4;
};

let answer = 0;
let answerAgiven = false;
let output = JSON.parse(JSON.stringify(map));
while (true) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === "." || !check({ x, y })) continue;
            output[y][x] = ".";
            answer++;
        }
    }

    if (JSON.stringify(map) === JSON.stringify(output)) {
        break;
    }

    if (!answerAgiven) {
        console.log("Answer A:", answer);
        answerAgiven = true;
    }

    map = JSON.parse(JSON.stringify(output));
}

console.log("Answer B:", answer);
