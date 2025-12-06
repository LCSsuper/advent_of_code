import { input } from "../helpers";

const sheet = input("./input.txt").split("\n");

const calculate = (nrs: number[], operation: "+" | "*") => {
    const firstValue = nrs.shift()!;
    return nrs.reduce((acc, val) => {
        if (operation === "*") return acc * val;
        if (operation === "+") return acc + val;
        throw new Error("Unknown operation: " + operation);
    }, firstValue);
};

const partA = () => {
    const parsed = sheet.map((line) => {
        // split on one or more spaces
        return line.split(/\s+/).filter(Boolean);
    });

    const operations = parsed.pop()!;

    let answerA = 0;
    for (const [index, operation] of operations.entries()) {
        const columnValues = parsed.map((row) => Number(row[index]));
        const answer = calculate(columnValues, operation as "+" | "*");

        answerA += answer;
    }

    console.log("answerA: ", answerA);
};

const partB = () => {
    const parsed = [...sheet];
    const operations = parsed.pop()!;

    let answerB = 0;
    let currentOperation: "+" | "*" | undefined;
    let currentNumbers: number[] = [];
    for (let i = 0; i < parsed[0].length; i++) {
        const potentialOperation = operations[i];
        if (potentialOperation === "+" || potentialOperation === "*") {
            currentOperation = potentialOperation;
        }

        const number = Number(parsed.map((row) => row[i]).join(""));

        if (number !== 0) {
            currentNumbers.push(number);
            continue;
        }

        answerB += calculate(currentNumbers, currentOperation!);

        currentNumbers = [];
        currentOperation = undefined;
    }

    answerB += calculate(currentNumbers, currentOperation!);

    console.log("answerB: ", answerB);
};

partA();
partB();
