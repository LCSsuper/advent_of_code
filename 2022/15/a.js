const fs = require("fs");

const diff = (a, b) => Math.abs(a - b);
const valueInRange = ([from, to] = [], value) => value >= from && value <= to;

const locations = fs
    .readFileSync("./input.txt")
    .toString()
    .split("\n")
    .map((row) => {
        let [sensorPosition, beaconPosition] = row.split(": ");
        sensorPosition = sensorPosition.replace("Sensor at ", "");
        beaconPosition = beaconPosition.replace("closest beacon is at ", "");
        const [sensorX, sensorY] = sensorPosition.split(", ");
        const [beaconX, beaconY] = beaconPosition.split(", ");
        const sensor = {
            x: Number(sensorX.replace("x=", "")),
            y: Number(sensorY.replace("y=", "")),
        };

        const beacon = {
            x: Number(beaconX.replace("x=", "")),
            y: Number(beaconY.replace("y=", "")),
        };

        const distance = diff(sensor.x, beacon.x) + diff(sensor.y, beacon.y);

        const visibility = {
            x: [sensor.x - distance, sensor.x + distance],
            y: [sensor.y - distance, sensor.y + distance],
        };

        return { sensor, beacon, distance, visibility };
    });

const Y = 2_000_000;

const sensorsThatSeeIndex = locations.filter(({ visibility }) => {
    const [from, to] = visibility.y;
    return Y >= from && Y <= to;
});

for (const locationData of sensorsThatSeeIndex) {
    const { visibility, sensor } = locationData;
    const difference = diff(sensor.y, Y);
    let [from, to] = visibility.x;
    locationData.visibilityAtIndex = [from + difference, to - difference];
}

sensorsThatSeeIndex.sort(
    ({ visibilityAtIndex: [fromA] }, { visibilityAtIndex: [fromB] }) =>
        fromA - fromB
);

const ranges = sensorsThatSeeIndex.reduce(
    (rngs, { visibilityAtIndex: [from, to] }) => {
        const [currentRange] = rngs;
        if (valueInRange(currentRange, from)) {
            rngs[0] = [
                Math.min(currentRange[0], from),
                Math.max(currentRange[1], to),
            ];
            return rngs;
        }

        rngs.unshift([from, to]);
        return rngs;
    },
    []
);

const totalPositions = ranges.reduce((acc, range) => acc + diff(...range), 0);

let beaconOrSensorCount = 0;
for (const { sensor, beacon } of locations) {
    if (
        sensor.y === Y &&
        ranges.some((range) => valueInRange(range, sensor.x))
    ) {
        beaconOrSensorCount + 1;
    }
    if (
        beacon.y === Y &&
        ranges.some((range) => valueInRange(range, beacon.x))
    ) {
        beaconOrSensorCount + 1;
    }
}

console.log("👤", totalPositions - beaconOrSensorCount);
