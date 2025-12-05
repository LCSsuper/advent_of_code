import { input } from "../helpers";

const raw = input("./input.txt");

let parsingRanges = true;
const ranges: { from: number; to: number }[] = [];
const ids: number[] = [];
for (const line of raw.split("\n")) {
    if (line.trim() === "") {
        parsingRanges = false;
        continue;
    }

    if (parsingRanges) {
        const [from, to] = line.split("-").map(Number);
        ranges.push({ from, to });
        continue;
    }

    const id = Number(line);
    ids.push(id);
}

let answerA = 0;
for (let id of ids) {
    for (let range of ranges) {
        if (id >= range.from && id <= range.to) {
            answerA++;
            break;
        }
    }
}
console.log("answerA: ", answerA);

const mergeRanges = (ranges: { from: number; to: number }[]) => {
    const mergedRanges: { from: number; to: number }[] = [];
    for (const range of ranges) {
        if (!mergedRanges.length) {
            mergedRanges.push({ ...range });
            continue;
        }

        const overlappingRange = mergedRanges.find(
            (r) =>
                (range.from >= r.from && range.from <= r.to) ||
                (range.to >= r.from && range.to <= r.to) ||
                (r.from >= range.from && r.from <= range.to) ||
                (r.to >= range.from && r.to <= range.to)
        );

        if (!overlappingRange) {
            mergedRanges.push({ ...range });
            continue;
        }

        overlappingRange.from = Math.min(overlappingRange.from, range.from);
        overlappingRange.to = Math.max(overlappingRange.to, range.to);
    }

    return mergedRanges;
};

let mergedRanges = JSON.parse(JSON.stringify(ranges));
while (true) {
    const newMergedRanges = mergeRanges(mergedRanges);
    if (newMergedRanges.length === mergedRanges.length) {
        break;
    }
    mergedRanges = newMergedRanges;
}

let answerB = 0;
for (const range of mergedRanges) {
    answerB += range.to - range.from + 1;
}
console.log("answerB:", answerB);
