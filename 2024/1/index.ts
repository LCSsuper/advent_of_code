import path from "path";
import { parseFile } from "../../utils/parseFile.js";
import { quickSort } from "../../utils/quickSort.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));

const a = () => {
    let { list1, list2 } = lines.reduce<{ list1: number[]; list2: number[] }>(
        (acc, line) => {
            if (!line) return acc;
            const [item1, item2] = line.split("   ");
            acc.list1.push(parseInt(item1));
            acc.list2.push(parseInt(item2));
            return acc;
        },
        { list1: [], list2: [] }
    );

    list1 = quickSort(list1);
    list2 = quickSort(list2);

    let accdiff = 0;
    for (let i = 0; i < list1.length; i++) {
        accdiff += Math.abs(list1[i] - list2[i]);
    }

    console.log(accdiff);
};

const b = () => {
    let { list, heatmap } = lines.reduce<{
        list: number[];
        heatmap: Map<number, number>;
    }>(
        (acc, line) => {
            if (!line) return acc;
            const [item1, item2] = line.split("   ");
            acc.list.push(parseInt(item1));
            acc.heatmap.set(
                parseInt(item2),
                (acc.heatmap.get(parseInt(item2)) || 0) + 1
            );
            return acc;
        },
        { list: [], heatmap: new Map<number, number>() }
    );

    let similarityScore = 0;
    for (const item of list) {
        similarityScore += item * (heatmap.get(item) || 0);
    }

    console.log(similarityScore);
};

// a();
b();
