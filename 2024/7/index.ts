import path from "path";
import { parseFile } from "../../utils/parseFile.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));

const equate = (test: number, acc: number, rest: number[]) => {
    if (rest.length === 0) {
        return acc === test;
    }
    const part = rest.shift();

    const added = acc + part!;
    const multiplied = acc * part!;
    const joined = parseInt(acc.toString() + part!.toString());

    if (equate(test, multiplied, [...rest])) {
        return true;
    }

    if (equate(test, added, [...rest])) {
        return true;
    }

    // This is part b
    if (equate(test, joined, [...rest])) {
        return true;
    }

    return false;
};

const aAndB = () => {
    let total = 0;
    for (const line of lines) {
        let [value, parts]: any[] = line.split(": ");
        value = parseInt(value);
        parts = parts.split(" ").map(Number);

        if (equate(value, parts.shift(), parts)) {
            total += value;
        }
    }

    console.log(total);
};

aAndB();
