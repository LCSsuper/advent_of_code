import path from "path";
import { parseFile } from "../../utils/parseFile.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));
const grid = lines.map((line) =>
    line.split("").map((nr) => (nr === "." ? -1 : parseInt(nr)))
);
const peaks = new Map<string, Set<string>>();

const part: string = "b";

const traverse = (y: number, x: number, path: string[]) => {
    const pos = grid[y][x];
    const key = `${x},${y}`;

    if (pos === 9) {
        if (part === "a") {
            peaks.set(
                path[0],
                (peaks.get(path[0]) || new Set<string>()).add(
                    [path[0], key].join(" ")
                )
            );
        }

        if (part === "b") {
            peaks.set(
                path[0],
                (peaks.get(path[0]) || new Set<string>()).add(
                    [...path, key].join(" ")
                )
            );
        }
        return;
    }

    const left = grid[y][x - 1];
    const right = grid[y][x + 1];
    const up = grid[y - 1]?.[x];
    const down = grid[y + 1]?.[x];

    if (left === pos + 1) {
        traverse(y, x - 1, [...path, key]);
    }

    if (right === pos + 1) {
        traverse(y, x + 1, [...path, key]);
    }

    if (up === pos + 1) {
        traverse(y - 1, x, [...path, key]);
    }

    if (down === pos + 1) {
        traverse(y + 1, x, [...path, key]);
    }
};

const test = () => {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 0) {
                traverse(y, x, []);
            }
        }
    }

    let sum = 0;
    for (const [key, value] of peaks) {
        sum += value.size;
    }

    console.log(sum);
};

test();
