import path from "path";
import { parseFile } from "../../utils/parseFile.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));

const parse = () => {
    const towels = lines.shift()?.split(", ") || [];
    const designs = lines.filter((line) => line);

    return {
        towels,
        designs,
    };
};

const map = new Map<string, number>();
const check = (towels: string[], design: string): number => {
    if (map.has(design)) {
        return map.get(design)!;
    }

    if (design.length === 0) {
        return 1;
    }

    const validTowels = towels.filter((t) => design.startsWith(t));

    map.set(
        design,
        validTowels.reduce((acc, towel) => {
            return acc + check(towels, design.slice(towel.length));
        }, 0)
    );

    return map.get(design)!;
};

const test = () => {
    const { towels, designs } = parse();

    let valid = 0;
    for (const design of designs) {
        if (check(towels, design)) {
            valid += 1;
        }
    }

    // a
    console.log(valid);

    let total = 0;
    for (const design of designs) {
        total += check(towels, design);
    }

    // b
    console.log(total);
};

test();
