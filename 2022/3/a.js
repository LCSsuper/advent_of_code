const fs = require("fs");
const items_in_rucksacks = fs
    .readFileSync("./input.txt")
    .toString()
    .split("\n")
    .map((row) => row.split(""));

const rucksacks = items_in_rucksacks.map((items) => {
    const compartment1 = items.slice(0, items.length / 2);
    const compartment2 = items.slice(items.length / 2);
    let recurring_item;
    for (const item of compartment1) {
        if (compartment2.includes(item)) {
            recurring_item = item;
            break;
        }
    }
    return { compartment1, compartment2, recurring_item };
});

const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const total_score = rucksacks.reduce(
    (score, { recurring_item }) =>
        score + characters.indexOf(recurring_item) + 1,
    0
);

console.log("🧖‍♀️", total_score);
