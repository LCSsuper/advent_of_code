import path from "path";
import { parseFile } from "../../utils/parseFile.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));

type Point = { x: number; y: number };

const draw = (map: string[][]) => {
    console.clear();
    console.log(map.map((row) => row.join("")).join("\n"));
};

const parse = (wide = false) => {
    let start: Point = { x: 0, y: 0 };
    const map: string[][] = [];

    while (lines.length) {
        const line = lines.shift();
        if (!line) break;
        const row: string[] = [];
        for (const point of line.split("")) {
            if (!wide) {
                row.push(point);
                continue;
            }

            if (point === "@") {
                row.push("@", ".");
            }
            if (point === "#") {
                row.push("#", "#");
            }
            if (point === ".") {
                row.push(".", ".");
            }
            if (point === "O") {
                row.push("[", "]");
            }
        }
        if (wide) {
            map.push;
        }
        map.push(row);
    }

    for (let y = 0; y < map.length; y += 1) {
        for (let x = 0; x < map[y].length; x += 1) {
            if (map[y][x] === "@") {
                start = { x, y };
            }
        }
    }

    const instructions = lines.join("");

    return { start, map, instructions };
};

const nextX = (x: number, direction: string, steps = 1) => {
    if (direction === "<") {
        return x - steps;
    }
    if (direction === ">") {
        return x + steps;
    }
    return x;
};

const nextY = (y: number, direction: string, steps = 1) => {
    if (direction === "^") {
        return y - steps;
    }
    if (direction === "v") {
        return y + steps;
    }
    return y;
};

const nextPos = (pos: Point, direction: string, steps = 1) => {
    return {
        x: nextX(pos.x, direction, steps),
        y: nextY(pos.y, direction, steps),
    };
};

const move = (pos: Point, map: string[][], direction: string) => {
    const newPos = nextPos(pos, direction);
    const char = map[newPos.y][newPos.x];

    if (char === "#") {
        return pos;
    }

    if (char === ".") {
        map[pos.y][pos.x] = ".";
        map[newPos.y][newPos.x] = "@";
        return newPos;
    }

    if (char === "O") {
        let steps = 1;
        while (true) {
            const laterPos = nextPos(newPos, direction, steps);
            if (map[laterPos.y][laterPos.x] === "#") {
                return pos;
            }
            if (map[laterPos.y][laterPos.x] === ".") {
                map[pos.y][pos.x] = ".";
                map[newPos.y][newPos.x] = "@";
                map[laterPos.y][laterPos.x] = "O";
                return newPos;
            }
            steps += 1;
        }
    }

    if ("[]".includes(char)) {
        if ("<>".includes(direction)) {
            let steps = 1;
            while (true) {
                const laterPos = nextPos(newPos, direction, steps);
                if (map[laterPos.y][laterPos.x] === "#") {
                    return pos;
                }
                if (map[laterPos.y][laterPos.x] === ".") {
                    map[laterPos.y].splice(laterPos.x, 1);
                    map[laterPos.y].splice(pos.x, 0, ".");
                    return newPos;
                }
                steps += 1;
            }
        }

        if ("^v".includes(direction)) {
            let y = newPos.y;
            let nextY = (cur: number) =>
                direction === "^" ? cur - 1 : cur + 1;

            // key is the y position, value is the x positions
            const boxesToMove = new Map<number, Set<number>>([
                [y, new Set([newPos.x])],
            ]);
            if (char === "[") {
                boxesToMove.get(y)?.add(newPos.x + 1);
            } else {
                boxesToMove.get(y)?.add(newPos.x - 1);
            }

            while (true) {
                const boxes = boxesToMove.get(y);
                for (const x of boxes!) {
                    if ("[]".includes(map[nextY(y)][x])) {
                        if (!boxesToMove.has(nextY(y))) {
                            boxesToMove.set(nextY(y), new Set());
                        }
                        boxesToMove.get(nextY(y))?.add(x);

                        if (map[nextY(y)][x] === "[") {
                            boxesToMove.get(nextY(y))?.add(x + 1);
                        } else {
                            boxesToMove.get(nextY(y))?.add(x - 1);
                        }
                    }

                    if (map[nextY(y)][x] === "#") {
                        return pos;
                    }
                }

                if (boxesToMove.has(nextY(y))) {
                    y = nextY(y);
                    continue;
                }

                // sort boxesToMove by y
                const boxesToMoveArr = Array.from(boxesToMove.entries());
                boxesToMoveArr.sort(([a], [b]) =>
                    direction === "^" ? a - b : b - a
                );

                for (const [y, xs] of boxesToMoveArr) {
                    for (const x of xs) {
                        map[nextY(y)][x] = map[y][x]; // only works for the boxesToMove are sorted by y
                        map[y][x] = ".";
                    }
                }

                map[pos.y][pos.x] = ".";
                map[newPos.y][newPos.x] = "@";

                return newPos;
            }
        }
    }

    return newPos;
};

const a = async () => {
    const { start, map, instructions } = parse();

    // draw(map);
    let pos = start;
    for (const instruction of instructions) {
        // await new Promise((resolve) => setTimeout(resolve, 200));
        pos = move(pos, map, instruction);
        // draw(map);
    }

    let total = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === "O") {
                total += y * 100 + x;
            }
        }
    }

    console.log(total);
};

const b = async () => {
    const { start, map, instructions } = parse(true);

    // draw(map);
    let pos = start;
    for (const instruction of instructions) {
        // await new Promise((resolve) => setTimeout(resolve, 50));
        pos = move(pos, map, instruction);
        // draw(map);
    }

    let total = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === "[") {
                total += y * 100 + x;
            }
        }
    }

    console.log(total);
};

// a();
b();
