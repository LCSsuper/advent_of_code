import path from "path";
import { parseFile } from "../../utils/parseFile.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));

const a = () => {
    const stones = lines[0].split(" ");

    let beforeBlink = [...stones];
    let afterBlink: string[] = [];
    for (let blink = 0; blink < 25; blink += 1) {
        for (const stone of beforeBlink) {
            if (stone.length % 2 === 0) {
                afterBlink.push(
                    `${Number(stone.slice(0, stone.length / 2))}`,
                    `${Number(stone.slice(stone.length / 2))}`
                );
                continue;
            }

            if (Number(stone) === 0) {
                afterBlink.push("1");
                continue;
            }

            afterBlink.push(`${Number(stone) * 2024}`);
            continue;
        }

        beforeBlink = [...afterBlink];
        afterBlink = [];
    }

    console.log(beforeBlink.length);
};

const stonesplits = new Map<string, number>();
const split = (stone: string, blink: number): number => {
    const key = `${stone}_${blink}`;
    if (blink === 75) {
        return 1;
    }

    if (stone.length % 2 === 0) {
        const left = `${Number(stone.slice(0, stone.length / 2))}`;
        const right = `${Number(stone.slice(stone.length / 2))}`;

        const leftkey = `${left}_${blink + 1}`;
        const rightkey = `${right}_${blink + 1}`;

        if (!stonesplits.has(leftkey)) {
            stonesplits.set(leftkey, split(left, blink + 1));
        }

        if (!stonesplits.has(rightkey)) {
            stonesplits.set(rightkey, split(right, blink + 1));
        }

        return stonesplits.get(leftkey)! + stonesplits.get(rightkey)!;
    }

    if (Number(stone) === 0) {
        const newkey = `1_${blink + 1}`;

        if (!stonesplits.has(newkey)) {
            stonesplits.set(newkey, split("1", blink + 1));
        }

        return stonesplits.get(newkey)!;
    }

    const newstone = `${Number(stone) * 2024}`;
    const newkey = `${newstone}_${blink + 1}`;

    if (!stonesplits.has(newkey)) {
        stonesplits.set(newkey, split(newstone, blink + 1));
    }

    return stonesplits.get(newkey)!;
};

const b = () => {
    const stones = lines[0].split(" ");

    const total = stones.reduce((acc, stone) => {
        return acc + split(stone, 0);
    }, 0);

    console.log(total);
};

// a()
b();
