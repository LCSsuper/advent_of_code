import * as fs from "fs";

export const parseFile = (path: string): string[] =>
    fs.readFileSync(path).toString().split("\n");
