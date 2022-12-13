const fs = require("fs");
const packets = fs
    .readFileSync("./input.txt")
    .toString()
    .split("\n\n")
    .map((packet) => {
        const [a, b] = packet.split("\n");
        return [JSON.parse(a), JSON.parse(b)];
    });

const comparePackets = (a, b, depth = 0) => {
    const pre = new Array(depth).fill("  ").join("");
    console.log(`${pre}- Compare ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
    while (a.length) {
        const left = a.shift();
        const right = b.shift();

        if (right === undefined) {
            console.log(
                `${pre}  - Right side ran out of items, so inputs are not in the right order`
            );
            return false;
        }

        if (Array.isArray(left) && Array.isArray(right)) {
            const valid = comparePackets(left, right, depth + 1);
            if (valid !== undefined) return valid;
            continue;
        }

        console.log(
            `${pre}  - Compare ${JSON.stringify(left)} vs ${JSON.stringify(
                right
            )}`
        );

        if (Array.isArray(left) && !Array.isArray(right)) {
            console.log(
                `${pre}    - Mixed types; Convert right to [${right}] and retry comparison`
            );
            const valid = comparePackets(left, [right], depth + 2);
            if (valid !== undefined) return valid;
            continue;
        }

        if (!Array.isArray(left) && Array.isArray(right)) {
            console.log(
                `${pre}    - Mixed types; Convert left to [${left}] and retry comparison`
            );
            const valid = comparePackets([left], right, depth + 2);
            if (valid !== undefined) return valid;
            continue;
        }

        if (left < right) {
            console.log(
                `${pre}      - Left side is smaller, so inputs are in the right order`
            );
            return true;
        }

        if (left > right) {
            console.log(
                `${pre}      - Right side is smaller, so inputs are not in the right order`
            );
            return false;
        }
    }

    if (b.length) {
        console.log(
            `${pre}  - Left side ran out of items, so inputs are in the right order`
        );
        return true;
    }

    return undefined;
};

const correctPairIndexes = [];
for (const [index, packet] of packets.entries()) {
    console.log(`== Pair ${index + 1} ==`);
    const valid = comparePackets(...packet);
    if (valid) correctPairIndexes.push(index + 1);
    console.log("");
}

console.log(
    "😚",
    correctPairIndexes.reduce((acc, val) => acc + val, 0)
);
