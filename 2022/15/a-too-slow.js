const fs = require("fs");
const difference = (a, b) => Math.abs(a - b);
const sensorsAndClosetBeacon = fs
    .readFileSync("./input.txt")
    .toString()
    .split("\n")
    .map((row) => {
        let [sensorPosition, beaconPosition] = row.split(": ");
        sensorPosition = sensorPosition.replace("Sensor at ", "");
        beaconPosition = beaconPosition.replace("closest beacon is at ", "");
        const [sensorX, sensorY] = sensorPosition.split(", ");
        const [beaconX, beaconY] = beaconPosition.split(", ");
        const locationData = {
            sensor: {
                x: Number(sensorX.replace("x=", "")),
                y: Number(sensorY.replace("y=", "")),
            },
            beacon: {
                x: Number(beaconX.replace("x=", "")),
                y: Number(beaconY.replace("y=", "")),
            },
        };

        locationData.distance =
            difference(locationData.sensor.x, locationData.beacon.x) +
            difference(locationData.sensor.y, locationData.beacon.y);

        return locationData;
    });

const largestDistance = sensorsAndClosetBeacon.reduce(
    (acc, { distance }) => (acc < distance ? distance : acc),
    0
);
const smallestSensorX =
    sensorsAndClosetBeacon.reduce(
        (acc, { sensor: { x } }) => (acc > x ? x : acc),
        Number.MAX_SAFE_INTEGER
    ) - largestDistance;
const largestSensorX =
    sensorsAndClosetBeacon.reduce(
        (acc, { sensor: { x } }) => (acc < x ? x : acc),
        0
    ) + largestDistance;
const smallestSensorY =
    sensorsAndClosetBeacon.reduce(
        (acc, { sensor: { y } }) => (acc > y ? y : acc),
        Number.MAX_SAFE_INTEGER
    ) - largestDistance;
const largestSensorY =
    sensorsAndClosetBeacon.reduce(
        (acc, { sensor: { y } }) => (acc < y ? y : acc),
        0
    ) + largestDistance;

const offsetX = difference(0, smallestSensorX);
const offsetY = difference(0, smallestSensorY);

const grid = [];
for (let x = 0; x <= largestSensorX + offsetX; x++) {
    for (let y = 0; y <= largestSensorY + offsetY; y++) {
        if (!grid[y]) grid[y] = [];
        grid[y][x] = ".";
        if (
            sensorsAndClosetBeacon.find(
                ({ sensor }) =>
                    sensor.x === x - offsetX && sensor.y === y - offsetY
            )
        ) {
            grid[y][x] = "S";
        }
        if (
            sensorsAndClosetBeacon.find(
                ({ beacon }) =>
                    beacon.x === x - offsetX && beacon.y === y - offsetY
            )
        ) {
            grid[y][x] = "B";
        }
    }
}

const markSpacesWithoutBeacon = ({ sensor, distance }) => {
    const sensorX = sensor.x + offsetX;
    const sensorY = sensor.y + offsetY;
    for (let y = sensorY - distance; y <= sensorY + distance; y++) {
        for (
            let x = sensorX - distance + difference(y, sensorY);
            x <= sensorX + distance - difference(y, sensorY);
            x++
        ) {
            if (grid[y][x] !== ".") continue;
            grid[y][x] = "#";
        }
    }
};

for (const sensorAndClosestBeacon of sensorsAndClosetBeacon) {
    markSpacesWithoutBeacon(sensorAndClosestBeacon);
}

const findPositionsWithoutBeacon = (y) => {
    return grid[y + offsetY].filter((pos) => pos === "#").length;
};

console.log("🧖‍♂️", findPositionsWithoutBeacon(2000000));
