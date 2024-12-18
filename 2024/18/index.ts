import path from "path";
import { parseFile } from "../../utils/parseFile.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));
const gridsize = 71;
const bytes = 1024;

// const lines = parseFile(path.join(process.cwd(), "data", "example.txt"));
// const gridsize = 7;
// const bytes = 12;

type Point = {
    x: number;
    y: number;
};

const parse = () => {
    const points: Point[] = [];

    for (const line of lines) {
        const [x, y] = line.split(",").map((val) => +val);
        points.push({ x, y });
    }

    return points;
};

const arr = (size: number, fill: () => any) =>
    Array.from({ length: size }, fill);

const draw = (map: string[][]) => {
    console.log(map.map((row) => row.join("")).join("\n"));
};

const map = (points: Point[]) => {
    const m = arr(gridsize, () => arr(gridsize, () => "."));

    for (const { x, y } of points) {
        m[y][x] = "#";
    }

    return m;
};

let quickest = Infinity;
const cheapest = new Map<string, number>();
const move = (map: string[][], pos: Point, path: Set<string>) => {
    const { x, y } = pos;
    if (x < 0 || x >= gridsize || y < 0 || y >= gridsize) {
        return;
    }

    if (x === gridsize - 1 && y === gridsize - 1 && path.size < quickest) {
        quickest = path.size;
        return;
    }

    if (map[y][x] === "#") {
        return;
    }

    const key = `${x},${y}`;
    if (path.has(key)) {
        return;
    }

    const cheapestPath = cheapest.get(key);

    if (cheapestPath !== undefined && path.size >= cheapestPath) {
        return;
    }

    cheapest.set(key, path.size);
    path.add(key);

    move(map, { x: x - 1, y }, new Set(path));
    move(map, { x: x + 1, y }, new Set(path));
    move(map, { x, y: y - 1 }, new Set(path));
    move(map, { x, y: y + 1 }, new Set(path));
};

const regions = (map: string[][], pos: Point, path: Set<string>) => {
    const regionGrid = map.map((row) => row.map(() => 0));

    let regionNr = 1;
    const regions = new Map<number, Set<string>>();
    for (let y = 0; y < map.length; y += 1) {
        for (let x = 0; x < map[y].length; x += 1) {
            const plot = map[y][x];

            if (plot === "#") {
                continue;
            }

            const neighborcoords = [
                { x: x, y: y - 1 },
                { x: x - 1, y: y },
                { x: x + 1, y: y },
                { x: x, y: y + 1 },
            ];

            let regionNrToUse: number | undefined = undefined;

            const matchingNeighbors: { x: number; y: number }[] = [];
            for (const coord of neighborcoords) {
                const region = regionGrid[y][x];
                const neighbor = map[coord.y]?.[coord.x];
                if (!neighbor) continue;

                const neighborRegion = regionGrid[coord.y][coord.x];

                if (neighbor !== plot) continue;

                matchingNeighbors.push(coord);
                if (region && neighborRegion && region !== neighborRegion) {
                    // merge regions
                    const minRegion = Math.min(region, neighborRegion);
                    const maxRegion = Math.max(region, neighborRegion);
                    regionNrToUse = minRegion;

                    if (regions.has(minRegion) && regions.has(maxRegion)) {
                        const plots = new Set([
                            ...Array.from(regions.get(minRegion)!),
                            ...Array.from(regions.get(maxRegion)!),
                        ]);
                        regions.set(minRegion, plots);
                        regions.delete(maxRegion);

                        for (const plot of plots) {
                            const [x, y] = plot.split(",").map(Number);
                            regionGrid[y][x] = minRegion;
                        }
                    }
                }

                regionNrToUse = region || neighborRegion;
            }

            if (!regionNrToUse) {
                regionNrToUse = regionNr;
                regionNr += 1;
            }

            regionGrid[y][x] = regionNrToUse;

            regions.set(regionNrToUse, regions.get(regionNrToUse) || new Set());
            regions.get(regionNrToUse)?.add(`${x},${y}`);

            for (const matchingNeighbor of matchingNeighbors) {
                regionGrid[matchingNeighbor.y][matchingNeighbor.x] =
                    regionNrToUse;

                regions
                    .get(regionNrToUse)
                    ?.add(`${matchingNeighbor.x},${matchingNeighbor.y}`);
            }
        }
    }

    for (const [regionNr, plots] of regions) {
        if (
            plots.has("0,0") &&
            plots.has(`${map.length - 1},${map.length - 1}`)
        ) {
            return true;
        }
    }

    return false;
};

const test = () => {
    const points = parse();
    let m = map(points.slice(0, bytes));
    // draw(m);

    // a
    // move(m, { x: 0, y: 0 }, new Set());
    // console.log(quickest);

    // b
    let testbytes = bytes;
    let pathexists = true;
    while (pathexists) {
        testbytes += 1;
        m = map(points.slice(0, testbytes));
        pathexists = regions(m, { x: 0, y: 0 }, new Set());
    }

    console.log(points[testbytes - 1]);
};

test();
