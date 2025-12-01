import fs from "fs";

export const input = (file: string): string =>
    fs.readFileSync(file, "utf-8").trim();
