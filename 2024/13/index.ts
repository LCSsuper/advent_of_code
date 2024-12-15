import path from "path";
import { parseFile } from "../../utils/parseFile.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));

type Clawmachine = {
    a: { x: number; y: number };
    b: { x: number; y: number };
    prize: { x: number; y: number };
};

const getClawmachines = (): Clawmachine[] => {
    const clawmachines: Clawmachine[] = [];

    let i = 0;
    while (i < lines.length) {
        const [a, b, prize] = lines.slice(i, i + 4).map((line) => {
            if (!line) return { x: 0, y: 0 };
            const [rawX, rawY] = line.split(": ")[1].split(", ");
            const x = +rawX.replace("X=", "").replace("X+", "");
            const y = +rawY.replace("Y=", "").replace("Y+", "");
            return { x, y };
        });

        clawmachines.push({ a, b, prize });

        i += 4;
    }

    return clawmachines;
};

const getMultiplier = (clawmachine: Clawmachine) => {
    const { a, b } = clawmachine;
    for (let useA = 0; useA < 100; useA += 1) {
        for (let useB = 0; useB < 100; useB += 1) {
            if (useA === 0 && useB === 0) {
                continue;
            }

            const sump = {
                x: a.x * useA + b.x * useB,
                y: a.y * useA + b.y * useB,
            };
            if (sump.x === sump.y) {
                return { sum: sump.x, useA, useB };
            }
        }
    }

    return { sum: 0, useA: 0, useB: 0 };
};

const getPressRelation = (clawmachine: Clawmachine, t: "x" | "y") => {
    const { a, b } = clawmachine;

    let divisible = 1;
    while (true) {
        if (divisible % a[t] === 0 && divisible % b[t] === 0) {
            break;
        }

        divisible += 1;
    }

    const aPresses = divisible / a[t];
    const bPresses = divisible / b[t];

    return { a: aPresses, b: bPresses };
};

const getFirstPressCombination = (
    pressRelation: { a: number; b: number },
    clawmachine: Clawmachine,
    t: "x" | "y"
) => {
    const { a, b, prize } = clawmachine;

    // start counting from button with lowest press rate
    const [l, r] = pressRelation.a < pressRelation.b ? [a, b] : [b, a];

    const o = t === "x" ? "y" : "x";

    let initialL = 1;
    let initialR = -1;
    while (true) {
        const remaining = prize[t] - initialL * l[t];

        if (initialL * l[o] >= prize[o]) {
            break;
        }

        if (remaining % r[t] === 0) {
            initialR = remaining / r[t];
            break;
        }
        initialL += 1;
    }

    if (initialR === -1) {
        // no valid combination
        return { a: 0, b: 0 };
    }

    return pressRelation.a < pressRelation.b
        ? { a: initialL, b: initialR }
        : { a: initialR, b: initialL };
};

const findPushCombinations = (clawmachine: Clawmachine) => {
    const { a, b, prize } = clawmachine;

    const combinations = new Set<string>();

    const multiplier = getMultiplier(clawmachine);

    const basePresses =
        multiplier.sum === 0
            ? 0
            : Math.min(
                  Math.floor(prize.x / multiplier.sum),
                  Math.floor(prize.y / multiplier.sum)
              ) - 100;

    prize.x = prize.x - basePresses * multiplier.sum;
    prize.y = prize.y - basePresses * multiplier.sum;

    const relation = getPressRelation(clawmachine, "x");
    const initial = getFirstPressCombination(relation, clawmachine, "x");

    if (initial.a === 0 && initial.b === 0) {
        return combinations;
    }

    let pressesMultiplier = 0;
    while (true) {
        let nextA = initial.a;
        let nextB = initial.b;

        if (initial.a < initial.b) {
            nextA += relation.a * pressesMultiplier;
            nextB -= relation.b * pressesMultiplier;
        } else {
            nextA -= relation.a * pressesMultiplier;
            nextB += relation.b * pressesMultiplier;
        }

        if (nextA <= 0 || nextB <= 0) {
            break;
        }

        if (nextA * a.y + nextB * b.y === prize.y) {
            combinations.add(
                `${basePresses * multiplier.useA + nextA},${
                    basePresses * multiplier.useB + nextB
                }`
            );
        }

        pressesMultiplier += 1;
    }

    return combinations;
};

const testClawmachine = (clawmachine: Clawmachine) => {
    const matching = findPushCombinations(clawmachine);
    const [match] = Array.from(matching);
    if (!match) {
        return 0;
    }

    const [pushesA, pushesB] = match.split(",");
    return +pushesA * 3 + +pushesB;
};

const test = (part: string) => {
    const clawmachines = getClawmachines();

    let total = 0;
    for (const clawmachine of clawmachines) {
        if (part === "b") {
            clawmachine.prize.x += 10000000000000;
            clawmachine.prize.y += 10000000000000;
        }
        total += testClawmachine(clawmachine);
    }

    console.log(total);
};

test("a");
// test("b");
