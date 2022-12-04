const fs = require("fs");
const assignments = fs
    .readFileSync("./input.txt")
    .toString()
    .split("\n")
    .map((row) =>
        row
            .split(",")
            .map((min_max) => min_max.split("-").map((nr) => Number(nr)))
    );

const assignments_with_overlap = assignments.filter(
    ([[min_a, max_a], [min_b, max_b]]) =>
        (max_a >= min_b && max_a <= max_b) || (max_b >= min_a && max_b <= max_a)
);

console.log("🙇‍♀️", assignments_with_overlap.length);
