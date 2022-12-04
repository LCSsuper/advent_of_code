const fs = require("fs");

const mapping = {
    ROCK: { X: "SCISSORS", Y: "ROCK", Z: "PAPER" },
    PAPER: { X: "ROCK", Y: "PAPER", Z: "SCISSORS" },
    SCISSORS: { X: "PAPER", Y: "SCISSORS", Z: "ROCK" },
};

const rounds = fs
    .readFileSync("./input.txt")
    .toString()
    .split("\n")
    .map((row) => {
        let [player2, player1] = row.split(" ");
        player2 = { A: "ROCK", B: "PAPER", C: "SCISSORS" }[player2];
        player1 = mapping[player2][player1];
        return { player1, player2 };
    });

const scoresheet = {
    ROCK: { points: 1, ROCK: 3, PAPER: 0, SCISSORS: 6 },
    PAPER: { points: 2, ROCK: 6, PAPER: 3, SCISSORS: 0 },
    SCISSORS: { points: 3, ROCK: 0, PAPER: 6, SCISSORS: 3 },
};

const points_per_round = rounds.map(
    (round) =>
        scoresheet[round.player1].points +
        scoresheet[round.player1][round.player2]
);

const total_score = points_per_round.reduce((acc, val) => acc + val, 0);

console.log("✋", total_score);
