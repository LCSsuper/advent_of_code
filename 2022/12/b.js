const fs = require("fs");
const heightMap = [..."abcdefghijklmnopqrstuvwxyz"];
const grid = fs
    .readFileSync("./input.txt")
    .toString()
    .split("\n")
    .map((row) =>
        row
            .split("")
            .map((square) =>
                ["S", "E"].includes(square) ? square : heightMap.indexOf(square)
            )
    );

const visitedLocations = [];

const findShortestPath = (startCoordinates) => {
    const [distanceFromTop, distanceFromLeft] = startCoordinates;
    visitedLocations.push(`${distanceFromTop}-${distanceFromLeft}`);

    const location = {
        distanceFromTop,
        distanceFromLeft,
        path: [],
        status: "Start",
    };

    const queue = [location];

    while (queue.length > 0) {
        const currentLocation = queue.shift();

        let newLocation = exploreInDirection(currentLocation, "North");
        if (newLocation.status === "Goal") {
            return newLocation.path;
        }
        if (newLocation.status === "Valid") {
            queue.push(newLocation);
        }

        newLocation = exploreInDirection(currentLocation, "East");
        if (newLocation.status === "Goal") {
            return newLocation.path;
        }
        if (newLocation.status === "Valid") {
            queue.push(newLocation);
        }

        newLocation = exploreInDirection(currentLocation, "South");
        if (newLocation.status === "Goal") {
            return newLocation.path;
        }
        if (newLocation.status === "Valid") {
            queue.push(newLocation);
        }

        newLocation = exploreInDirection(currentLocation, "West");
        if (newLocation.status === "Goal") {
            return newLocation.path;
        }
        if (newLocation.status === "Valid") {
            queue.push(newLocation);
        }
    }

    return false;
};

const locationStatus = (currentLocation, newLocation) => {
    const gridHeight = grid.length;
    const gridWidth = grid[0].length;
    const cdft = currentLocation.distanceFromTop;
    const cdfl = currentLocation.distanceFromLeft;
    const ndft = newLocation.distanceFromTop;
    const ndfl = newLocation.distanceFromLeft;

    const isOutOfBounds =
        newLocation.distanceFromLeft < 0 ||
        newLocation.distanceFromLeft >= gridWidth ||
        newLocation.distanceFromTop < 0 ||
        newLocation.distanceFromTop >= gridHeight;

    if (isOutOfBounds || visitedLocations.includes(`${ndft}-${ndfl}`)) {
        return "Invalid";
    }

    let current = grid[cdft][cdfl];
    let destination = grid[ndft][ndfl];
    if (current === "E") current = heightMap.indexOf("z");
    if (destination === "S") destination = heightMap.indexOf("a");
    if (destination - current < -1) return "Invalid";

    if (grid[ndft][ndfl] === 0) {
        return "Goal";
    }

    return "Valid";
};

var exploreInDirection = (currentLocation, direction) => {
    const newPath = currentLocation.path.slice();
    newPath.push(direction);

    let dft = currentLocation.distanceFromTop;
    let dfl = currentLocation.distanceFromLeft;

    if (direction === "North") {
        dft -= 1;
    }
    if (direction === "East") {
        dfl += 1;
    }
    if (direction === "South") {
        dft += 1;
    }
    if (direction === "West") {
        dfl -= 1;
    }

    const newLocation = {
        distanceFromTop: dft,
        distanceFromLeft: dfl,
        path: newPath,
        status: "Unknown",
    };

    newLocation.status = locationStatus(currentLocation, newLocation);

    if (newLocation.status === "Valid") {
        visitedLocations.push(
            `${newLocation.distanceFromTop}-${newLocation.distanceFromLeft}`
        );
    }

    return newLocation;
};

let startingCoordinates;
for (let x = 0; x < grid.length; x++) {
    const index = grid[x].indexOf("E");
    if (index === -1) continue;
    startingCoordinates = [x, index];
    break;
}

console.log(findShortestPath(startingCoordinates).length);
