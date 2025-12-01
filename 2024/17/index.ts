import path from "path";
import fs from "fs";
import { parseFile } from "../../utils/parseFile.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));

type Registers = Map<string, number>;

const parse = () => {
    const registers: Registers = new Map();
    let program: number[] = [];

    for (const line of lines) {
        const [key, value] = line.split(": ");
        if (key.includes("Register ")) {
            registers.set(key.replace("Register ", ""), +value);
        }
        if (key === "Program") {
            program = value.split(",").map((val) => +val);
        }
    }

    return { registers, program };
};

const combo = (operand: number, registers: Registers) => {
    if (0 >= operand || operand <= 3) {
        return operand;
    }
    if (operand === 4) {
        return registers.get("A")!;
    }
    if (operand === 5) {
        return registers.get("B")!;
    }
    if (operand === 6) {
        return registers.get("C")!;
    }
    throw new Error("Invalid operand");
};

// The adv instruction (opcode 0) performs division.
// The numerator is the value in the A register.
// The denominator is found by raising 2 to the power
// of the instruction's combo operand.
// (So, an operand of 2 would divide A by 4 (2^2);
// an operand of 5 would divide A by 2^B.)
// The result of the division operation is truncated
// to an integer and then written to the A register.

const adv = (operand: number, registers: Registers) => {
    const numerator = registers.get("A")!;
    const denominator = 2 ** combo(operand, registers);
    const truncated = ~~(numerator / denominator);
    registers.set("A", truncated);
};

// The bxl instruction (opcode 1) calculates
// the bitwise XOR of register B and the
// instruction's literal operand,
// then stores the result in register B.

const bxl = (operand: number, registers: Registers) => {
    const result = registers.get("B")! ^ operand;
    registers.set("B", result);
};

// The bst instruction (opcode 2) calculates
// the value of its combo operand modulo 8
// (thereby keeping only its lowest 3 bits),
// then writes that value to the B register.

const bst = (operand: number, registers: Registers) => {
    const result = combo(operand, registers) % 8;
    registers.set("B", result);
};

// The jnz instruction (opcode 3) does nothing
// if the A register is 0.
// However, if the A register is not zero,
// it jumps by setting the instruction
// pointer to the value of its literal operand;
// if this instruction jumps, the instruction
// pointer is not increased by 2 after this instruction.

const jnz = (operand: number, registers: Registers): number => {
    if (registers.get("A") === 0) return -1;
    return operand;
};

// The bxc instruction (opcode 4) calculates the
//  bitwise XOR of register B and register C,
// then stores the result in register B.
// (For legacy reasons, this instruction reads an operand but ignores it.)

const bxc = (operand: number, registers: Registers) => {
    const result = registers.get("B")! ^ registers.get("C")!;
    registers.set("B", result);
};

// The out instruction (opcode 5) calculates the
// value of its combo operand modulo 8,
// then outputs that value.
// (If a program outputs multiple values, they are separated by commas.)

const out = (operand: number, registers: Registers): number => {
    const result = combo(operand, registers) % 8;
    return result;
};

// The bdv instruction (opcode 6) works exactly
// like the adv instruction except that the result
//  is stored in the B register.
// (The numerator is still read from the A register.)

const bdv = (operand: number, registers: Registers) => {
    const numerator = registers.get("A")!;
    const denominator = 2 ** combo(operand, registers);
    const truncated = ~~(numerator / denominator);
    registers.set("B", truncated);
};

// The cdv instruction (opcode 7) works exactly
// like the adv instruction except that the result
// is stored in the C register.
// (The numerator is still read from the A register.)

const cdv = (operand: number, registers: Registers) => {
    const numerator = registers.get("A")!;
    const denominator = 2 ** combo(operand, registers);
    const truncated = ~~(numerator / denominator);
    registers.set("C", truncated);
};

const run = (registers: Registers, program: number[]) => {
    let pointer = 0;
    const output: number[] = [];
    while (pointer < program.length) {
        const opcode = program[pointer];
        const operand = program[pointer + 1];

        if (opcode === 0) adv(operand, registers);
        if (opcode === 1) bxl(operand, registers);
        if (opcode === 2) bst(operand, registers);
        if (opcode === 3) {
            const jump = jnz(operand, registers);
            if (jump !== -1) {
                pointer = jump;
                continue;
            }
        }
        if (opcode === 4) bxc(operand, registers);
        if (opcode === 5) output.push(out(operand, registers));
        if (opcode === 6) bdv(operand, registers);
        if (opcode === 7) cdv(operand, registers);

        pointer += 2;
    }

    return output.join(",");
};

const test = () => {
    const { registers, program } = parse();

    // a
    // console.log(run(registers, program));

    // b
    // reverse engineer the program by this output: 2,4,1,7,7,5,0,3,4,0,1,7,5,5,3,0
};

test();
