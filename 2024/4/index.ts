import path from "path";
import { parseFile } from "../../utils/parseFile.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));

const a = () => {
    const grid = lines.map((line) => line.split(""));

    let total = 0;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            // horizontal right
            if (
                `${grid[y]?.[x]}${grid[y]?.[x + 1]}${grid[y]?.[x + 2]}${
                    grid[y]?.[x + 3]
                }` === "XMAS"
            ) {
                total += 1;
            }

            // horizontal left
            if (
                `${grid[y]?.[x]}${grid[y]?.[x - 1]}${grid[y]?.[x - 2]}${
                    grid[y]?.[x - 3]
                }` === "XMAS"
            ) {
                total += 1;
            }

            // vertical down
            if (
                `${grid[y]?.[x]}${grid[y + 1]?.[x]}${grid[y + 2]?.[x]}${
                    grid[y + 3]?.[x]
                }` === "XMAS"
            ) {
                total += 1;
            }

            // vertical up
            if (
                `${grid[y]?.[x]}${grid[y - 1]?.[x]}${grid[y - 2]?.[x]}${
                    grid[y - 3]?.[x]
                }` === "XMAS"
            ) {
                total += 1;
            }

            // diagonal down right
            if (
                `${grid[y]?.[x]}${grid[y + 1]?.[x + 1]}${grid[y + 2]?.[x + 2]}${
                    grid[y + 3]?.[x + 3]
                }` === "XMAS"
            ) {
                total += 1;
            }

            // diagonal up right
            if (
                `${grid[y]?.[x]}${grid[y - 1]?.[x + 1]}${grid[y - 2]?.[x + 2]}${
                    grid[y - 3]?.[x + 3]
                }` === "XMAS"
            ) {
                total += 1;
            }

            // diagonal down left
            if (
                `${grid[y]?.[x]}${grid[y + 1]?.[x - 1]}${grid[y + 2]?.[x - 2]}${
                    grid[y + 3]?.[x - 3]
                }` === "XMAS"
            ) {
                total += 1;
            }

            // diagonal up left
            if (
                `${grid[y]?.[x]}${grid[y - 1]?.[x - 1]}${grid[y - 2]?.[x - 2]}${
                    grid[y - 3]?.[x - 3]
                }` === "XMAS"
            ) {
                total += 1;
            }
        }
    }

    console.log(total);
};

const b = () => {
    const grid = lines.map((line) => line.split(""));

    let total = 0;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const cell = grid[y][x];

            if (cell !== "A") continue;

            const upleft = grid[y - 1]?.[x - 1];
            const upright = grid[y - 1]?.[x + 1];
            const downleft = grid[y + 1]?.[x - 1];
            const downright = grid[y + 1]?.[x + 1];

            if (
                ((upleft === "M" && downright === "S") ||
                    (upleft === "S" && downright === "M")) &&
                ((upright === "M" && downleft === "S") ||
                    (upright === "S" && downleft === "M"))
            ) {
                total += 1;
            }
        }
    }

    console.log(total);
};

// a();
b();
