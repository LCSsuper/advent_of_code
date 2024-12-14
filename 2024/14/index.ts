import path from "path";
import { parseFile } from "../../utils/parseFile.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));
const [gridX, gridY] = lines.shift()!.split(",");
const grid = { x: +gridX, y: +gridY };

type Robot = {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
};

type Quadrant = {
    x: { min: number; max: number };
    y: { min: number; max: number };
    count: number;
};

const clamp = (min: number, max: number, test: number) =>
    Math.min(Math.max(test, min), max);

const getRobots = (): Robot[] => {
    const robots: Robot[] = [];

    for (const line of lines) {
        const [rawPos, rawVel] = line.split(" ");
        const [posX, posY] = rawPos.replace("p=", "").split(",");
        const [velX, velY] = rawVel.replace("v=", "").split(",");

        robots.push({
            position: { x: +posX, y: +posY },
            velocity: { x: +velX, y: +velY },
        });
    }

    return robots;
};

const move = (robot: Robot, seconds: number) => {
    robot.position.x = (robot.position.x + robot.velocity.x * seconds) % grid.x;
    robot.position.y = (robot.position.y + robot.velocity.y * seconds) % grid.y;

    if (robot.position.x < 0) robot.position.x += grid.x;
    if (robot.position.y < 0) robot.position.y += grid.y;
};

const a = () => {
    const robots = getRobots();

    const quadrants: Quadrant[] = [
        {
            x: { min: 0, max: Math.floor(grid.x / 2) - 1 },
            y: { min: 0, max: Math.floor(grid.y / 2) - 1 },
            count: 0,
        },
        {
            x: { min: Math.ceil(grid.x / 2), max: grid.x },
            y: { min: 0, max: Math.floor(grid.y / 2) - 1 },
            count: 0,
        },
        {
            x: { min: 0, max: Math.floor(grid.x / 2) - 1 },
            y: { min: Math.ceil(grid.y / 2), max: grid.y },
            count: 0,
        },
        {
            x: { min: Math.ceil(grid.x / 2), max: grid.x },
            y: { min: Math.ceil(grid.y / 2), max: grid.y },
            count: 0,
        },
    ];
    for (const robot of robots) {
        move(robot, 100);
        for (const quadrant of quadrants) {
            if (
                clamp(quadrant.x.min, quadrant.x.max, robot.position.x) ===
                    robot.position.x &&
                clamp(quadrant.y.min, quadrant.y.max, robot.position.y) ===
                    robot.position.y
            ) {
                quadrant.count += 1;
            }
        }
    }

    let total = quadrants.shift()!.count;
    for (const quadrant of quadrants) {
        total *= quadrant.count;
    }

    console.log("💁‍♂️", total);
};

const b = async () => {
    // the answer was 6398
    // I just kept looking until I saw the easter egg flash by
    for (let seconds = 0; seconds < 10000; seconds += 1) {
        const robots = getRobots();

        const positions = new Map<string, number>();
        for (const robot of robots) {
            move(robot, seconds);
            const key = `${robot.position.x},${robot.position.y}`;
            positions.set(key, (positions.get(key) || 0) + 1);
        }

        const lines: string[] = [];
        for (let y = 0; y < grid.y; y += 1) {
            let line = "";
            for (let x = 0; x < grid.x; x += 1) {
                const key = `${x},${y}`;
                line += positions.get(key) ? "#" : ".";
            }
            lines.push(line);
        }

        console.clear();
        console.log(lines.join("\n"));
        console.log(seconds);
        await new Promise((resolve) => setTimeout(resolve, 50));
    }
};

// a();
b();
