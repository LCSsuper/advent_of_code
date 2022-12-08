const fs = require("fs");
const treeGridRowBased = fs
    .readFileSync("./input.txt")
    .toString()
    .split("\n")
    .map((row) => row.split("").map((tree) => Number(tree)));

const treeGridColumnBased = [];
for (
    let columnIndex = 0;
    columnIndex < treeGridRowBased[0].length;
    columnIndex++
) {
    const column = treeGridRowBased.reduce((acc, val) => {
        acc.push(val[columnIndex]);
        return acc;
    }, []);
    treeGridColumnBased.push(column);
}

const isAtBounds = (x, y) =>
    x === 0 ||
    x === treeGridRowBased.length - 1 ||
    y === 0 ||
    y === treeGridRowBased[0].length - 1;

let visibleTreeCount = 0;
for (let rowIndex = 0; rowIndex < treeGridRowBased.length; rowIndex++) {
    const row = treeGridRowBased[rowIndex];
    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        const column = treeGridColumnBased[columnIndex];
        const currentTree = row[columnIndex];
        if (isAtBounds(rowIndex, columnIndex)) {
            visibleTreeCount += 1;
            continue;
        }

        const treesToTheLeft = row.slice(0, columnIndex);
        const treesToTheRight = row.slice(columnIndex + 1);
        const treesToTheTop = column.slice(0, rowIndex);
        const treesToTheBottom = column.slice(rowIndex + 1);
        if (
            treesToTheLeft.every((tree) => tree < currentTree) ||
            treesToTheRight.every((tree) => tree < currentTree) ||
            treesToTheTop.every((tree) => tree < currentTree) ||
            treesToTheBottom.every((tree) => tree < currentTree)
        ) {
            visibleTreeCount += 1;
        }
    }
}

console.log("😮", visibleTreeCount);
