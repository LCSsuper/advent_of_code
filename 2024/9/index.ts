import path from "path";
import { parseFile } from "../../utils/parseFile.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));

type File = {
    size: number;
    id: number;
};

type Empty = {
    size: number;
    files: File[];
};

const a = () => {
    const nrs = lines[0].split("").map((line) => parseInt(line, 10));
    const pos: number[] = [];
    for (let i = 0; i < nrs.length; i += 1) {
        if (i % 2 === 0) {
            const blocks = nrs[i];
            for (let block = 0; block < blocks; block++) {
                pos.push(i / 2);
            }
        } else {
            for (let block = 0; block < nrs[i]; block++) {
                pos.push(-1);
            }
        }
    }

    for (let i = 0; i < pos.length; i += 1) {
        if (pos[i] === undefined) continue;
        if (pos[i] !== -1) continue;
        let end = pos.pop();
        while (end === -1) {
            end = pos.pop();
        }

        if (end === undefined) break;

        pos[i] = end;
    }

    const sum = pos.reduce((acc, curr, index) => acc + curr * index, 0);
    console.log(sum);
};

const b = () => {
    const nrs = lines[0].split("").map((line) => parseInt(line, 10));
    const files = nrs
        .filter((undefined, index) => index % 2 === 0)
        .map<File>((size, index) => ({
            id: index,
            size,
        }));

    const emptyspaces = nrs
        .filter((undefined, index) => index % 2 === 1)
        .map<Empty>((size) => ({
            size,
            files: [],
        }));

    for (let i = files.length - 1; i >= 0; i -= 1) {
        const file = files[i];

        if (!file) continue;

        const j = emptyspaces.findIndex(({ size }) => size >= file.size);
        if (j > i || j === -1) continue; // no empty space to the left or none at all

        emptyspaces[j].size -= file.size;
        emptyspaces[j].files.push(file);
        files[i] = { size: file.size, id: 0 }; // mark as empty
    }

    const blocks: number[] = [];
    for (let i = 0; i < emptyspaces.length; i += 1) {
        const file = files[i];
        for (let j = 0; j < file.size; j += 1) {
            blocks.push(file.id);
        }

        const empty = emptyspaces[i];
        for (let j = 0; j < empty.files.length; j += 1) {
            for (let k = 0; k < empty.files[j].size; k += 1) {
                blocks.push(empty.files[j].id);
            }
        }
        for (let j = 0; j < empty.size; j += 1) {
            blocks.push(0);
        }
    }

    let sum = 0;
    for (let i = 0; i < blocks.length; i += 1) {
        sum += blocks[i] * i;
    }

    console.log(sum);
};

// a();
b();
