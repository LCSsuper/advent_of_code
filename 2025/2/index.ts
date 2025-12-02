import { input } from "../helpers";

const ranges = input("./input.txt").split(",");

const divideIntoEqualParts = (id: string, parts: number = 2): string[] => {
    if (id.length % parts !== 0) return [];
    const partLength = id.length / parts;
    const result = [];
    for (let i = 0; i < parts; i++) {
        result.push(id.slice(i * partLength, (i + 1) * partLength));
    }
    return result;
};

let answerA = 0;
let answerB = 0;

const partA = (id: string) => {
    const parts = new Set(divideIntoEqualParts(id));
    if (parts.size !== 1) return;
    answerA += Number(id);
};

const partB = (id: string) => {
    let partsCount = 1;
    while (true) {
        partsCount++;
        if (partsCount > id.length) break;
        const parts = new Set(divideIntoEqualParts(id, partsCount));
        if (parts.size !== 1) continue;
        answerB += Number(id);
        break;
    }
};

for (const range of ranges) {
    const [start, end] = range.split("-").map(Number);
    for (let i = start; i <= end; i++) {
        partA(i.toString());
        partB(i.toString());
    }
}

console.log("answer A:", answerA);
console.log("answer B:", answerB);
