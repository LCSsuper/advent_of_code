import path from "path";
import { parseFile } from "../../utils/parseFile.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));

const rows = lines.map((line) => line.split(""));
const columns: string[][] = [];
for (let X = 0; X < rows[0].length; X += 1) {
    const column = rows.map((row) => row[X]);
    columns.push(column);
}

const traverse = (
    startPos: number[],
    startDir: number,
    obstacle?: number[]
) => {
    let pos = [...startPos];
    let dir = startDir;

    const nextPos = ([x, y]: number[], direction: number) =>
        [
            [x, y - 1],
            [x + 1, y],
            [x, y + 1],
            [x - 1, y],
        ][direction % 4];

    const turns = new Set<string>();
    const visited = new Set<string>();
    let finished = false;

    do {
        const [x, y] = pos;
        visited.add(pos.join(","));

        const next = nextPos([x, y], dir);

        if (
            rows[next[1]]?.[next[0]] === "#" ||
            obstacle?.join(",") === next.join(",")
        ) {
            if (turns.has(`${pos.join(",")},${dir % 4}`)) {
                throw new Error("Loop detected");
            }
            turns.add(`${pos.join(",")},${dir % 4}`);
            dir += 1;
            continue;
        }

        if (rows[next[1]]?.[next[0]] === undefined) {
            finished = true;
            break;
        }

        pos = next;
    } while (!finished);

    return visited;
};

const start = () => {
    for (let X = 0; X < columns.length; X += 1) {
        const Y = columns[X].findIndex((char) => char === "^");
        if (Y === -1) continue;
        return [X, Y];
    }

    throw new Error("No start found");
};

const a = () => {
    console.log(traverse(start(), 0).size);
};

const b = () => {
    const walked = traverse(start(), 0);

    const obstructions = new Set<string>();

    for (const blockade of walked) {
        const [X, Y] = blockade.split(",").map(parseInt);
        try {
            traverse(start(), 0, [X, Y]);
        } catch (e) {
            obstructions.add(blockade);
        }
    }

    console.log(obstructions.size);
};

a();
b();
