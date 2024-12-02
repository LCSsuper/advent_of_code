import path from "path";
import { parseFile } from "../../utils/parseFile.js";
import { quickSort } from "../../utils/quickSort.js";

const lines = parseFile(path.join(process.cwd(), "data", "input.txt"));

const checkLine = (line: string) => {
    const report = line.split(" ").map((num) => parseInt(num));
    const set = new Set(report);

    if (set.size !== report.length) {
        // duplicate numbers
        return false;
    }

    const sorted = quickSort(report);
    const increasing = sorted.join(" ");
    const decreasing = sorted.reverse().join(" ");

    if (line !== increasing && line !== decreasing) {
        // not sorted
        return false;
    }

    for (let i = 0; i < report.length - 1; i++) {
        if (Math.abs(report[i] - report[i + 1]) > 3) {
            // jump too big
            return false;
        }
    }

    return true;
};

const a = () => {
    let validReports = 0;
    for (const line of lines) {
        if (!checkLine(line)) continue;
        validReports += 1;
    }

    console.log(validReports);
};

const b = () => {
    let validReports = 0;
    for (const line of lines) {
        if (checkLine(line)) {
            validReports += 1;
            continue;
        }

        // convert line into multiple lines where each line has one number removed
        const report = line.split(" ").map((num) => parseInt(num));
        for (let i = 0; i < report.length; i++) {
            const modifiedReport = report.slice();
            modifiedReport.splice(i, 1);

            if (checkLine(modifiedReport.join(" "))) {
                validReports += 1;
                break;
            }
        }
    }

    console.log(validReports);
};

// a();
b();
