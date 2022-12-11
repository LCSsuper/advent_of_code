const fs = require("fs");

let commonDivisor = 1;
const monkeys = fs
    .readFileSync("./input.txt")
    .toString()
    .split("\n\n")
    .map((monkey) => {
        const [, itemsRaw, operationRaw, testRaw, ifTrueRaw, ifFalseRaw] =
            monkey.split("\n");

        const items = itemsRaw
            .split(": ")[1]
            .split(", ")
            .map((item) => Number(item));
        const [, operation] = operationRaw.split(" = ");
        const test = Number(testRaw.split(" ").pop());
        const ifTrue = Number(ifTrueRaw.split(" ").pop());
        const ifFalse = Number(ifFalseRaw.split(" ").pop());
        commonDivisor *= test;
        return { items, operation, test, ifTrue, ifFalse, inspections: 0 };
    });

const playRound = () => {
    for (const monkey of monkeys) {
        while (monkey.items.length) {
            monkey.inspections += 1;
            let item = monkey.items.shift();
            item = eval(monkey.operation.split("old").join(item));
            item = item % commonDivisor;
            monkeys[
                item % monkey.test === 0 ? monkey.ifTrue : monkey.ifFalse
            ].items.push(item);
        }
    }
};

const playRounds = (amount) => {
    for (let round = 0; round < amount; round++) {
        playRound();
    }
};

playRounds(10000);

monkeys.sort((a, b) => b.inspections - a.inspections);
console.log("🤭", monkeys[0].inspections * monkeys[1].inspections);
