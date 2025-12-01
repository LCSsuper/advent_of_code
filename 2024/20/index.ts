import path from "path";
import { parseFile } from "../../utils/parseFile.js";

const lines = parseFile(path.join(process.cwd(), "data", "example.txt"));
const max = 20;

type Point = { x: number; y: number };

const draw = (map: string[][]) => {
    console.clear();
    console.log(map.map((row) => row.join("")).join("\n"));
};

const parse = () => {
    let start: Point = { x: 0, y: 0 };
    const map: string[][] = [];

    while (lines.length) {
        const line = lines.shift();
        if (!line) break;
        const row: string[] = [];
        for (const point of line.split("")) {
            row.push(point);
        }
        map.push(row);
    }

    for (let y = 0; y < map.length; y += 1) {
        for (let x = 0; x < map[y].length; x += 1) {
            if (map[y][x] === "S") {
                start = { x, y };
            }
        }
    }

    return { start, map };
};

const neighbors = [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
];

const original = (start: Point, map: string[][]) => {
    const copy = map.map((row) => [...row]);
    let current = start;
    const path: Point[] = [start];

    outer: while (true) {
        copy[current.y][current.x] = "O";
        for (const neighbor of neighbors) {
            const x = current.x + neighbor.x;
            const y = current.y + neighbor.y;

            if (copy[y]?.[x] === "E") {
                path.push({ x, y });
                current = { x, y };
                break outer;
            }

            if (copy[y]?.[x] === ".") {
                path.push({ x, y });
                current = { x, y };
                break;
            }
        }
    }

    return path;
};

const a = () => {
    const { start, map } = parse();

    const og = original(start, map);
    const cost = new Map(
        og.map((point, index) => [`${point.x},${point.y}`, index])
    );

    const cheats = new Map<number, number>();
    for (const [index, { x, y }] of og.entries()) {
        for (const neighbor of neighbors) {
            let cheat = "";
            for (let multiplier = 1; multiplier <= 3; multiplier += 1) {
                const x1 = x + neighbor.x * multiplier;
                const y1 = y + neighbor.y * multiplier;

                cheat += map[y1]?.[x1] || " ";
            }

            let foundcheat: number | undefined = undefined;

            if (cheat === "##." || cheat === "##E") {
                // found cheat with picoseconds 2
                foundcheat = 3;
            }

            if (
                cheat.substring(0, 2) === "#." ||
                cheat.substring(0, 2) === "#E"
            ) {
                // found cheat with picoseconds 1
                foundcheat = 2;
            }

            if (!foundcheat) continue;

            const originalpicoseconds = cost.get(
                `${x + neighbor.x * foundcheat},${y + neighbor.y * foundcheat}`
            )!;
            const newpicoseconds = index + foundcheat;
            const cheatsaves = originalpicoseconds - newpicoseconds;
            if (cheatsaves < 0) continue;
            cheats.set(cheatsaves, (cheats.get(cheatsaves) || 0) + 1);
        }
    }

    let total = 0;
    for (const [savedpicoseconds, count] of cheats) {
        if (savedpicoseconds < 100) continue;
        total += count;
    }

    console.log(total);
};

const findCheat = (
    from: Point,
    path: Set<string>,
    meta: {
        picoseconds: number;
        map: string[][];
        cost: Map<string, number>;
        cheats: Map<number, number>;
        cheatpaths: Map<string, number>;
    }
) => {
    const { x, y } = from;
    const key = `${x},${y}`;
    if (path.has(key)) return;
    if (path.size > max) return;
    if (meta.map[y]?.[x] === undefined) return;
    path.add(key);

    if (meta.map[y]?.[x] === "E" || meta.map[y]?.[x] === ".") {
        if (path.size === 2) {
            // aint no cheat here boys
            return;
        }

        if (path.size > 2) {
            const originalpicoseconds = meta.cost.get(`${x},${y}`)!;
            const newpicoseconds = meta.picoseconds + path.size - 1;
            const cheatsaves = originalpicoseconds - newpicoseconds;
            const start = Array.from(path)[0];
            const end = Array.from(path)[path.size - 1];
            const cheatpath = `${start} -> ${end}`;
            if (
                cheatsaves > 0 &&
                (meta.cheatpaths.get(cheatpath) || Infinity) < cheatsaves
            ) {
                meta.cheatpaths.set(cheatpath, cheatsaves);
            }
        }
    }

    for (const neighbor of neighbors) {
        const to = { x: from.x + neighbor.x, y: from.y + neighbor.y };
        findCheat(to, new Set(path), meta);
    }
};

const b = () => {
    const { start, map } = parse();

    const og = original(start, map);
    const cost = new Map(
        og.map((point, index) => [`${point.x},${point.y}`, index])
    );

    const cheats = new Map<number, number>();
    const cheatpaths = new Map<string, number>();
    for (const [picoseconds, { x, y }] of og.entries()) {
        findCheat({ x, y }, new Set(), {
            picoseconds,
            map,
            cost,
            cheats,
            cheatpaths,
        });
    }

    console.log(cheatpaths);

    let total = 0;
    for (const [, cheatsaves] of cheatpaths) {
        if (cheatsaves < 50) continue;
        total += 1;
    }

    console.log(total);
};

b();
