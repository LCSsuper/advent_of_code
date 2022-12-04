const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString();
const totals_per_elf = input
    .split("\n\n")
    .map((food) => food.split("\n").reduce((acc, val) => acc + Number(val), 0))
    .sort((a, b) => b - a);

console.log(
    "🤡",
    totals_per_elf.shift() + totals_per_elf.shift() + totals_per_elf.shift()
);
