const fs = require("fs");

const input = fs.readFileSync("./input.txt").toString();
const [crate_input, procedure] = input.split("\n\n");

const convert_crate_input_to_stacks = () => {
    const rows = crate_input.split("\n");
    rows.reverse().shift();
    let row = [...rows.shift()];
    let index = 0;
    let stacks = [];
    while (row?.length) {
        const crate = row.splice(0, 4)[1];
        if (crate !== " ") {
            if (!stacks[index]) stacks[index] = [];
            stacks[index].push(crate);
        }

        index += 1;
        if (!row?.length && rows.length) {
            row = [...rows.shift()];
            index = 0;
        }
    }
    return stacks;
};

const convert_procedure_into_steps = () => {
    const rows = procedure.split("\n");
    return rows.map((row) => {
        const [, amount, , from, , to] = row.split(" ");
        return { amount: Number(amount), from: Number(from), to: Number(to) };
    });
};

const stacks = convert_crate_input_to_stacks();
const steps = convert_procedure_into_steps();

const do_step = ({ amount, from, to }) => {
    const from_stack = stacks[from - 1];
    const stacks_to_move = from_stack.splice(
        from_stack.length - amount,
        amount
    );
    stacks[to - 1].push(...stacks_to_move);
};

for (const step of steps) {
    do_step(step);
}

const get_top_crates = () => {
    return stacks.reduce((acc, val) => `${acc}${val.pop()}`, "");
};

console.log("👨‍👩‍👦‍👦", get_top_crates());
