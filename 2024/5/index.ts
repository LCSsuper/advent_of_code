import path from "path";
import { parseFile } from "../../utils/parseFile.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));

const getRulesAndUpdates = (): {
    rules: Map<string, string[]>;
    updates: string[][];
} => {
    const separator = lines.indexOf("");
    const rules = lines.slice(0, separator).reduce((map, rule) => {
        const [x, y] = rule.split("|");
        map.set(x, map.has(x) ? [...map.get(x)!, y] : [y]);
        return map;
    }, new Map<string, string[]>());
    const updates = lines
        .slice(separator + 1)
        .map((update) => update.split(","));

    return { rules, updates };
};

const updateIsValid = (
    update: string[],
    rules: Map<string, string[]>
): boolean => {
    for (let i = 0; i <= update.length; i += 1) {
        const precedingPageNumbers = update.slice(0, i);
        const forbiddenPageNumbers = rules.get(update[i]);

        if (!forbiddenPageNumbers) continue;

        if (
            precedingPageNumbers.some((pagenr) =>
                forbiddenPageNumbers.includes(pagenr)
            )
        ) {
            return false;
        }
    }

    return true;
};

const reorderUpdate = (
    update: string[],
    rules: Map<string, string[]>
): string[] => {
    const reorderedUpdate: string[] = [];
    for (const current of update) {
        const forbiddenPageNumbers = rules.get(current);

        if (!forbiddenPageNumbers) {
            reorderedUpdate.push(current);
            continue;
        }

        const lowestIndex = forbiddenPageNumbers.reduce(
            (lowestIndex, pagenr) => {
                const index = reorderedUpdate.indexOf(pagenr);
                if (index === -1) return lowestIndex;
                return index < lowestIndex ? index : lowestIndex;
            },
            Infinity
        );

        if (lowestIndex === Infinity) {
            reorderedUpdate.push(current);
            continue;
        }

        // add the page number to the left of the lowest index
        reorderedUpdate.splice(lowestIndex, 0, current);
    }

    return reorderedUpdate;
};

const a = () => {
    const { rules, updates } = getRulesAndUpdates();

    let total = 0;
    for (const update of updates) {
        if (!updateIsValid(update, rules)) continue;

        total += parseInt(update[Math.floor(update.length / 2)]);
    }

    console.log(total);
};

const b = () => {
    const { rules, updates } = getRulesAndUpdates();

    let total = 0;
    for (const update of updates) {
        if (updateIsValid(update, rules)) continue;

        const reordered = reorderUpdate(update, rules);

        total += parseInt(reordered[Math.floor(reordered.length / 2)]);
    }

    console.log(total);
};

// a();
b();
