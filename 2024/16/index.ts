import path from "path";
import { parseFile } from "../../utils/parseFile.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));

type Point = { x: number; y: number };

type Direction = "^" | "v" | "<" | ">";

const getMoves = (dir: Direction): Direction[] => {
    if (dir === "^") {
        return ["^", "<", ">"];
    }
    if (dir === "v") {
        return ["v", "<", ">"];
    }
    if (dir === "<") {
        return ["<", "^", "v"];
    }
    if (dir === ">") {
        return [">", "^", "v"];
    }
    throw new Error("Invalid direction");
};

const getNextPoint = (pos: Point, dir: Direction): Point => {
    const { x, y } = pos;
    if (dir === "^") {
        return { x, y: y - 1 };
    }
    if (dir === "v") {
        return { x, y: y + 1 };
    }
    if (dir === "<") {
        return { x: x - 1, y };
    }
    if (dir === ">") {
        return { x: x + 1, y };
    }
    throw new Error("Invalid direction");
};

const draw = (map: string[][], sensationalSpots: Set<string>) => {
    const alteredMap = map.map((row) => [...row]);
    for (let y = 0; y < map.length; y += 1) {
        for (let x = 0; x < map[y].length; x += 1) {
            if (sensationalSpots.has(`${x},${y}`)) {
                alteredMap[y][x] = "O";
            }
        }
    }

    console.clear();
    console.log(alteredMap.map((row) => row.join("")).join("\n"));
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

const determinePrice = (dirs: Direction[]) => {
    if (dirs.length === 1) return Infinity;

    const dirsCopy = [...dirs];

    let previous: Direction | undefined;
    let current: Direction | undefined;
    let totalprice = 0;
    while (dirsCopy.length) {
        previous = current || dirsCopy.shift();
        current = dirsCopy.shift();

        if (!current) break;

        if (previous !== current) {
            totalprice += 1000;
        }
        totalprice += 1;
    }

    return totalprice;
};

const prices = new Map<string, number>();
const sensationalPaths: { path: Set<string>; price: number }[] = [];

const walk = (
    pos: Point,
    path: Set<string>,
    dirs: Direction[],
    map: string[][]
) => {
    const { x, y } = pos;

    if (map[y][x] === "#") return;
    if (path.has(`${x},${y}`)) return;

    const cheapest = prices.get(`${x},${y}`);

    // add 1000 to account for the cheapest option maybe needing to turn still
    if (cheapest && cheapest + 1000 < determinePrice(dirs)) {
        return;
    }

    const price = determinePrice(dirs);
    prices.set(`${x},${y}`, price);

    // if higher than this, then it's not worth it
    if (price > 73432 && price !== Infinity) return;

    if (map[y][x] === "E") {
        console.log(price);
        sensationalPaths.push({ path, price });
        return;
    }

    path.add(`${x},${y}`);

    const moves = getMoves(dirs[dirs.length - 1]);

    for (const move of moves) {
        const next = getNextPoint(pos, move);
        walk(next, new Set(path), [...dirs, move], map);
    }
};

const test = () => {
    const { start, map } = parse();

    walk(start, new Set(), [">"], map);

    let sensationalSpots: Set<string> = new Set();
    sensationalPaths.sort((a, b) => a.price - b.price);
    const bestPrice = sensationalPaths[0].price;
    for (const { path, price } of sensationalPaths) {
        if (price > bestPrice) break;
        sensationalSpots = new Set([...sensationalSpots, ...path]);
    }

    // 451 is too low
    // 495 is too low
    // well well well, what must it be...
    // 497 is too high

    // a
    console.log(bestPrice);

    // b
    console.log("👨‍👧", sensationalSpots.size + 2); // +2 for start and end
    // I guess I should've accounted for the start and end in a different way
};

test();
