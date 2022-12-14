const fs = require("fs");
let minX, maxX, minY, maxY;

const sandRows = fs
    .readFileSync("./input.txt")
    .toString()
    .split("\n")
    .map((row) =>
        row.split(" -> ").map((coordinates) => {
            let [y, x] = coordinates.split(",");
            x = Number(x);
            y = Number(y);
            if (!minX || x < minX) minX = x;
            if (!maxX || x > maxX) maxX = x;
            if (!minY || y < minY) minY = y;
            if (!maxY || y > maxY) maxY = y;

            return [x, y];
        })
    );

const grid = [];
for (let x = 0; x <= maxX + 2; x++) {
    for (let y = minY - 500; y <= maxY + 500; y++) {
        if (!grid[x]) grid[x] = [];
        grid[x][y] = x === maxX + 2 ? "#" : ".";
    }
}

for (const row of sandRows) {
    let [startX, startY] = row.shift();
    grid[startX][startY] = "#";
    while (row.length) {
        const [endX, endY] = row.shift();
        if (startX !== endX) {
            for (
                let x = startX > endX ? endX : startX;
                x <= (startX < endX ? endX : startX);
                x++
            ) {
                grid[x][startY] = "#";
            }
        }
        if (startY !== endY) {
            for (
                let y = startY > endY ? endY : startY;
                y <= (startY < endY ? endY : startY);
                y++
            ) {
                grid[startX][y] = "#";
            }
        }
        startX = endX;
        startY = endY;
    }
}

const dropSand = (x, y) => {
    for (const [newX, newY] of [
        [x + 1, y],
        [x + 1, y - 1],
        [x + 1, y + 1],
    ]) {
        if (grid[newX][newY] === ".") {
            return dropSand(newX, newY);
        }
    }

    grid[x][y] = "o";
    return x !== 0 || y !== 500;
};

let units = 0;
do {
    units += 1;
} while (dropSand(0, 500));
console.log("🥰", units);
