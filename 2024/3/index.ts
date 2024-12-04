import path from "path";
import { parseFile } from "../../utils/parseFile.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));

// mul\([0-9]{1,3},[0-9]{1,3}\)+

const a = () => {
    let total = 0;
    for (const line of lines) {
        for (const match of line.match(/mul\(([0-9]{1,3},[0-9]{1,3})\)/g)!) {
            const [x, y] = match
                .replace("mul(", "")
                .replace(")", "")
                .split(",");
            total += parseInt(x) * parseInt(y);
        }
    }

    console.log(total);
};

const b = () => {
    let total = 0;
    let enabled = true;
    for (const line of lines) {
        for (const match of line.match(
            /mul\([0-9]{1,3},[0-9]{1,3}\)|do\(\)|don't\(\)/g
        )!) {
            if (match === "do()") {
                enabled = true;
                continue;
            }
            if (match === "don't()") {
                enabled = false;
                continue;
            }

            if (!enabled) {
                continue;
            }

            const [x, y] = match
                .replace("mul(", "")
                .replace(")", "")
                .split(",");
            total += parseInt(x) * parseInt(y);
        }
    }

    console.log(total);
};

// a();
b();
