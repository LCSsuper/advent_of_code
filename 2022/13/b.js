const fs = require("fs");
const packets = fs
    .readFileSync("./input.txt")
    .toString()
    .split("\n\n")
    .join("\n")
    .split("\n")
    .map((packet) => JSON.parse(packet));

packets.push([[2]], [[6]]);

const comparePackets = (a, b, depth = 0) => {
    while (a.length) {
        const left = a.shift();
        const right = b.shift();

        if (right === undefined) {
            return false;
        }

        if (Array.isArray(left) && Array.isArray(right)) {
            const valid = comparePackets(left, right, depth + 1);
            if (valid !== undefined) return valid;
            continue;
        }

        if (Array.isArray(left) && !Array.isArray(right)) {
            const valid = comparePackets(left, [right], depth + 2);
            if (valid !== undefined) return valid;
            continue;
        }

        if (!Array.isArray(left) && Array.isArray(right)) {
            const valid = comparePackets([left], right, depth + 2);
            if (valid !== undefined) return valid;
            continue;
        }

        if (left < right) {
            return true;
        }

        if (left > right) {
            return false;
        }
    }

    if (b.length) {
        return true;
    }

    return undefined;
};

const orderedPackets = [packets.shift()];

while (packets.length) {
    let placedInOrderedPackets = false;
    const packet = packets.shift();
    for (const [index, orderedPacket] of orderedPackets.entries()) {
        const valid = comparePackets(
            JSON.parse(JSON.stringify(packet)),
            JSON.parse(JSON.stringify(orderedPacket))
        );
        if (valid) {
            orderedPackets.splice(index, 0, packet);
            placedInOrderedPackets = true;
            break;
        }
    }
    if (!placedInOrderedPackets) orderedPackets.push(packet);
}

const stringifiedOrderedPackets = orderedPackets.map((orderedPacket) =>
    JSON.stringify(orderedPacket)
);
console.log(
    "👎",
    (stringifiedOrderedPackets.indexOf("[[2]]") + 1) *
        (stringifiedOrderedPackets.indexOf("[[6]]") + 1)
);
