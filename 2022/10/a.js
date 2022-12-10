const fs = require("fs");
const commands = fs.readFileSync("./input.txt").toString().split("\n");

let cycle = 0;
let x = 1;
const signalStrengths = [];

while (true) {
    cycle += 1;
    if (cycle % 40 === 20) {
        signalStrengths.push(cycle * x);
    }
    if (!commands.length) break;

    const command = commands.shift();
    if (command.startsWith("addx")) {
        const [, amount] = command.split(" ");
        cycle += 1;
        if (cycle % 40 === 20) {
            signalStrengths.push(cycle * x);
        }
        x = x + Number(amount);
    }
}

console.log(
    "🙌",
    signalStrengths.reduce((acc, val) => acc + val, 0)
);
