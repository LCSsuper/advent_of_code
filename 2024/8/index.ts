import path from "path";
import { parseFile } from "../../utils/parseFile.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));
const grid = lines.map((line) => line.split(""));

const test = (part: "a" | "b") => {
    const frequencies = new Map<string, { x: number; y: number }[]>();

    for (const [y, row] of grid.entries()) {
        for (const [x, cell] of row.entries()) {
            if (cell === ".") continue;
            const antennas = frequencies.get(cell) || [];
            antennas.push({ x, y });
            frequencies.set(cell, antennas);
        }
    }

    const antinodes = new Set<string>();

    for (const antennas of frequencies.values()) {
        for (const antenna1 of antennas) {
            if (part === "b") {
                antinodes.add(`${antenna1.x},${antenna1.y}`);
            }
            for (const antenna2 of antennas) {
                if (antenna2.x === antenna1.x && antenna2.y === antenna1.y) {
                    continue;
                }

                const disx = Math.abs(antenna1.x - antenna2.x);
                const disy = Math.abs(antenna1.y - antenna2.y);
                const minx = Math.min(antenna1.x, antenna2.x);
                const maxx = Math.max(antenna1.x, antenna2.x);
                const miny = Math.min(antenna1.y, antenna2.y);
                const maxy = Math.max(antenna1.y, antenna2.y);

                const diagonalup =
                    (antenna1.x - antenna2.x) * (antenna1.y - antenna2.y) < 0;

                const antinode1 = {
                    x: minx - disx,
                    y: diagonalup ? maxy + disy : miny - disy,
                };

                const antinode2 = {
                    x: maxx + disx,
                    y: diagonalup ? miny - disy : maxy + disy,
                };

                if (grid[antinode1.y]?.[antinode1.x] !== undefined) {
                    grid[antinode1.y][antinode1.x] = "#";
                    antinodes.add(`${antinode1.x},${antinode1.y}`);
                }

                if (grid[antinode2.y]?.[antinode2.x] !== undefined) {
                    grid[antinode2.y][antinode2.x] = "#";
                    antinodes.add(`${antinode2.x},${antinode2.y}`);
                }

                if (part === "b") {
                    let antinode = antinode1;
                    while (true) {
                        antinode = {
                            x: antinode.x - disx,
                            y: diagonalup
                                ? antinode.y + disy
                                : antinode.y - disy,
                        };

                        if (grid[antinode.y]?.[antinode.x] === undefined) {
                            break;
                        }

                        grid[antinode.y][antinode.x] = "#";
                        antinodes.add(`${antinode.x},${antinode.y}`);
                    }

                    antinode = antinode2;
                    while (true) {
                        antinode = {
                            x: antinode.x + disx,
                            y: diagonalup
                                ? antinode.y - disy
                                : antinode.y + disy,
                        };

                        if (grid[antinode.y]?.[antinode.x] === undefined) {
                            break;
                        }

                        grid[antinode.y][antinode.x] = "#";
                        antinodes.add(`${antinode.x},${antinode.y}`);
                    }
                }
            }
        }
    }

    console.log(antinodes.size);
};

test("b");
