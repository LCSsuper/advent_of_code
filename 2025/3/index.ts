import { input } from "../helpers";

const banks = input("./input.txt")
    .split("\n")
    .map((line) => line.split("").map(Number));

const getLargestJoltage = (bank: number[], minRemaining: number) => {
    const largestJoltages = bank.toSorted((a, b) => b - a);
    for (const largestJoltage of largestJoltages) {
        const remaining = bank.slice(bank.indexOf(largestJoltage) + 1);
        if (remaining.length < minRemaining) continue; // not enough batteries on the right
        return { largestJoltage, remaining };
    }

    return { largestJoltage: 0, remaining: [] };
};

let answerA = 0;
let answerB = 0;
for (const bank of banks) {
    const { largestJoltage, remaining } = getLargestJoltage(bank, 1)!;
    answerA += Number(`${largestJoltage}${Math.max(...remaining)}`);

    let joltage = "";
    let currentBank = bank;
    while (true) {
        const result = getLargestJoltage(currentBank, 11 - joltage.length);
        if (!result) break;
        joltage += result.largestJoltage.toString();
        currentBank = result.remaining;
        if (joltage.length === 12) break;
    }
    answerB += Number(joltage);
}

console.log("Answer A: ", answerA);
console.log("Answer B: ", answerB);
