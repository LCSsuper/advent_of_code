const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString().split("\n");

const extractCurrentDir = () => {
    const dir = { size: 0 };
    do {
        const line = input.shift();
        const [a, b, c] = line.split(" ");
        if (a === "dir") continue;
        if (!Number.isNaN(Number(a))) {
            dir.size = dir.size + Number(a);
            continue;
        }
        if (b === "ls") continue;
        if (b === "cd" && c === "..") break;
        if (b === "cd") {
            dir[c] = extractCurrentDir();
            dir.size = dir.size + dir[c].size;
        }
    } while (input.length);
    return dir;
};

input.shift(); // remove cd /
input.shift(); // remove ls
const dir = extractCurrentDir();

const allDirSizes = [];
const getAllDirSizes = (directory) => {
    for (const [key, value] of Object.entries(directory)) {
        if (key === "size") allDirSizes.push(value);
        if (key !== "size") getAllDirSizes(value);
    }
};

const neededSpace = dir.size - 70_000_000 + 30_000_000;

getAllDirSizes(dir);
allDirSizes.sort((a, b) => a - b);
for (const size of allDirSizes) {
    if (size >= neededSpace) {
        console.log("👺", size);
        break;
    }
}
