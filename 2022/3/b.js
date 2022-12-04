const fs = require("fs");
const items_in_rucksacks = fs
    .readFileSync("./input.txt")
    .toString()
    .split("\n")
    .map((row) => row.split(""));

const priority_per_group = [];
const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
while (items_in_rucksacks.length) {
    const group = items_in_rucksacks.splice(0, 3);
    for (const item of group[0]) {
        if (group[1].includes(item) && group[2].includes(item)) {
            priority_per_group.push(characters.indexOf(item) + 1);
            break;
        }
    }
}

const total_score = priority_per_group.reduce((acc, val) => acc + val, 0);

console.log("🧖‍♀️", total_score);
