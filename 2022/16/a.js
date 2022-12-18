const fs = require("fs");
const allValves = fs
    .readFileSync("./input.txt")
    .toString()
    .split("\n")
    .reduce((map, row) => {
        let [valve, connections] = row.split("; ");
        const [, flowRate] = valve.split("=");
        [, valve] = valve.split(" ");
        connections = connections
            .replace("tunnel leads to valve ", "")
            .replace("tunnels lead to valves ", "")
            .split(", ");

        map.set(valve, {
            id: valve,
            flow: Number(flowRate),
            connections,
        });
        return map;
    }, new Map());

const copy = (obj) => JSON.parse(JSON.stringify(obj));

const possiblePaths = (valves, path, paths = []) => {
    const maxMoves = valves.length;
    if (path.length === maxMoves) return paths;
    const [valveId] = path;
    const valve = valves.find(({ id }) => id === valveId);
    if (!valve.open && path.length > 1) {
        paths.push({ path, flow: valve.flow });
    }

    for (const newValveId of valve.connections.filter(
        (connection) => !path.includes(connection)
    )) {
        possiblePaths(valves, [newValveId, ...path], paths);
    }

    return paths;
};

let locations = [
    {
        pressure: 0,
        path: ["AA"],
        minutesLeft: 30,
        valves: [...allValves.values()].map((valve) => ({
            id: valve.id,
            connections: valve.connections,
            open: valve.flow === 0,
            flow: valve.flow,
        })),
    },
];

const finishedLocations = [];

const updatePressure = (location) => {
    location.minutesLeft -= 1;
    const openValves = location.valves.filter(({ open }) => open);
    const totalFlow = openValves.reduce((acc, { flow }) => acc + flow, 0);
    location.pressure += totalFlow;
};

const explore = () => {
    const newLocations = [];
    for (const location of locations) {
        if (location.minutesLeft <= 0) {
            finishedLocations.push(location);
            continue;
        }

        const [currentValveId] = location.path;
        const currentValveIndex = location.valves.findIndex(
            ({ id }) => id === currentValveId
        );

        if (!location.valves[currentValveIndex].open) {
            updatePressure(location);
            location.valves[currentValveIndex].open = true;
        }

        const paths = possiblePaths(location.valves, [currentValveId])
            .map((path) => {
                path.path.pop();
                return path;
            })
            .filter((path) => path.path.length <= location.minutesLeft)
            .sort((a, b) => {
                const maxMoves = Math.max(a.path.length, b.path.length) + 1;
                const aScore = (maxMoves - a.path.length) * a.flow;
                const bScore = (maxMoves - b.path.length) * b.flow;
                return bScore - aScore;
            });

        if (!paths.length) {
            for (const _ of new Array(location.minutesLeft).fill(null)) {
                updatePressure(location);
            }
            finishedLocations.push(location);
        }

        for (const { path } of paths.slice(0, 3)) {
            const newLocation = copy(location);
            for (const _ of path) {
                updatePressure(newLocation);
            }
            newLocation.path = [...path, ...location.path];
            newLocations.push(newLocation);
        }
    }
    locations = newLocations;
};

while (locations.length) {
    explore();
}

console.log("☂", finishedLocations.sort((a, b) => b.pressure - a.pressure)[0]);
