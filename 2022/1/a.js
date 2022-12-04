const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString();
const food = input.split("\n\n").map((food) => food.split("\n"));
const highest_calories = food.reduce((highest_calory_total, calories_array) => {
    const total_calories = calories_array.reduce(
        (total, calories) => total + Number(calories),
        0
    );
    if (total_calories > highest_calory_total) return total_calories;
    return highest_calory_total;
}, 0);
console.log("🦸‍♀️", highest_calories);
