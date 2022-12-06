const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString().split("\n");
for (const row of input) {
    const characters = [...row];
    const current_marker = [];
    for (let i = 0; i < characters.length; i++) {
        const character = characters[i];
        current_marker.push(character);
        if (current_marker.length > 14) current_marker.shift();
        if (current_marker.length === 14) {
            const set = new Set(current_marker);
            if (set.size === 14) {
                console.log("👩", i + 1);
                break;
            }
        }
    }
}
