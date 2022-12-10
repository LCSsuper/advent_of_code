const fs = require("fs");
const commands = fs.readFileSync("./input.txt").toString().split("\n");

let cycle = 0;
let x = 1;
let crt = "";

while (true) {
    if (!commands.length) break;
    const pixel = [x - 1, x, x + 1];
    cycle += 1;
    crt += pixel.includes((cycle - 1) % 40) ? "#" : ".";
    if (cycle % 40 === 0) crt += "\n";

    const command = commands.shift();
    if (command.startsWith("addx")) {
        const [, amount] = command.split(" ");
        cycle += 1;
        crt += pixel.includes((cycle - 1) % 40) ? "#" : ".";
        x = x + Number(amount);
        if (cycle % 40 === 0) crt += "\n";
    }
}

console.log(crt);
