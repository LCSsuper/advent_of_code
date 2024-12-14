import path from "path";
import { parseFile } from "../../utils/parseFile.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));
const grid = lines.map((line) => line.split(""));

const test = (part: string) => {
    const regionGrid = grid.map((row) => row.map(() => 0));

    let regionNr = 1;
    const regions = new Map<number, Set<string>>();
    for (let y = 0; y < grid.length; y += 1) {
        for (let x = 0; x < grid[y].length; x += 1) {
            const plot = grid[y][x];

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
                const neighbor = grid[coord.y]?.[coord.x];
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

    let total = 0;
    for (const [id, region] of regions) {
        const fences = Array.from(region).reduce<string[]>((fences, plot) => {
            const [x, y] = plot.split(",").map(Number);
            const type = grid[y][x];

            const neighborcoords = [
                { x: x, y: y - 1, side: "top" },
                { x: x - 1, y: y, side: "left" },
                { x: x + 1, y: y, side: "right" },
                { x: x, y: y + 1, side: "bottom" },
            ];

            for (const coord of neighborcoords) {
                const neighbor = grid[coord.y]?.[coord.x];
                if (neighbor !== type) {
                    fences.push(`${coord.side}_${x}_${y}`);
                }
            }

            return fences;
        }, []);

        if (part === "a") {
            total += region.size * fences.length;
            continue;
        }

        const sides = new Map<string, number[]>();

        for (const fence of fences) {
            const [side, x, y] = fence.split("_");
            const key = `${side}_${["top", "bottom"].includes(side) ? y : x}`;
            sides.set(key, sides.get(key) || []);
            sides
                .get(key)
                ?.push(Number(["top", "bottom"].includes(side) ? x : y));
        }

        let totalsides = 0;
        for (const coords of sides.values()) {
            totalsides += 1;
            if (coords.length === 1) {
                continue;
            }
            coords.sort((a, b) => a - b);

            for (let i = 1; i < coords.length; i += 1) {
                const diff = coords[i] - coords[i - 1];
                if (diff > 1) {
                    totalsides += 1;
                }
            }
        }

        const price = region.size * totalsides;
        total += price;
    }

    console.log(total);
};

test("a");
test("b");
