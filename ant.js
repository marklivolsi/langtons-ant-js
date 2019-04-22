// const orientations = ["UP", "RIGHT", "DOWN", "LEFT"];
const orientations = ["↑", "→", "↓", "←"];

const white = "rgb(255, 255, 255)";
const black = "rgb(0, 0, 0)";
let rows;

// TODO: Allow user to specify starting orientation, delay interval,

let ant = {
    currentOrientation: undefined,
    startPosition: undefined,
    currentPosition: undefined,
    prevPosition: undefined,
    steps: 0,

    //  Initialize ant positions, ensuring the ant starts near the center of the grid
    initialize: function(n) {
        if (n % 2 === 0) {
            this.startPosition = Math.floor((n*n)/2) + Math.ceil(n/2);
        } else {
            this.startPosition = Math.floor((n * n) / 2);
        }
        this.currentOrientation = "↑";
        this.currentPosition = this.startPosition;
        this.prevPosition = this.startPosition;
        this.steps = 0;
    },

    move: function() {
        const currentColor = getComputedStyle(document.getElementById(this.currentPosition.toString())).backgroundColor;
        this.currentOrientation = changeOrientation(this.currentOrientation, currentColor);
        setArrow(this.currentPosition.toString(), this.prevPosition.toString(), this.currentOrientation, currentColor);
        this.prevPosition = this.currentPosition;
        switchColor(this.currentPosition.toString(), currentColor);
        this.currentPosition = changePosition(this.currentPosition, this.currentOrientation);
        this.steps++;
    }
};

//  Generate the grid and run the main animation loop
async function genGrid() {
    const gridContainer = document.getElementById("grid-container");
    const n = parseInt(document.getElementById("grid-size").value);
    rows = n;

    //  Clears existing grid
    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }

    //  Create new grid based on specified grid size
    for (let i = 0; i < n*n; i++) {
        let gridCell = document.createElement("div");
        gridCell.className = "grid-cell";
        gridCell.id = `${i}`;
        gridCell.style.width = `${100/n}%`;
        gridCell.style.height = `${100/n}%`;
        gridContainer.appendChild(gridCell);
        }
    ant.initialize(n);

    //  Main loop
    while (ant.currentPosition > 0 && ant.currentPosition < n*n) {
        ant.move();
        const currentColor = getComputedStyle(document.getElementById(ant.currentPosition.toString())).backgroundColor;
        console.log(`Taking step #${ant.steps}. Current color: ${currentColor}, orientation: ${ant.currentOrientation}, position: ${ant.currentPosition}`);
        await sleep(1000);
    }
}

//  Switch the background color of a cell from white > black and vice versa
function switchColor(cellId, currentColor) {
    if (currentColor === white) {
        document.getElementById(cellId).style.backgroundColor = black;
    } else {
        document.getElementById(cellId).style.backgroundColor = white;
    }
}

//  Sets the arrow icon indicating direction of next move
function setArrow(cellId, prevCell, currentOrientation, currentColor) {
    document.getElementById(cellId).innerText = currentOrientation;
    if (currentColor === white) {
        document.getElementById(cellId).style.color = white;
    } else {
        document.getElementById(cellId).style.color = black;
    }
    if (ant.steps > 0) {
        document.getElementById(prevCell).innerText = "";
    }
}

//  Determines direction of next move depending on cell color
function changeOrientation(currentOrientation, currentColor) {
    let newIndex;
    const currentIndex = orientations.indexOf(currentOrientation);
    if (currentColor === white) {
        newIndex = currentIndex + 1;
    } else {
        newIndex = currentIndex - 1;
    }
    if (newIndex < 0) {
        newIndex = orientations.length - 1;
    } else if (newIndex >= orientations.length) {
        newIndex = 0;
    }
    return orientations[newIndex];
}

//  Updates the position based on direction of next move
function changePosition(currentPosition, currentOrientation) {
    let newPosition;
    switch (currentOrientation) {
        case "↑":
            newPosition = currentPosition - rows;
            break;
        case "→":
            newPosition = currentPosition + 1;
            break;
        case "↓":
            newPosition = currentPosition + rows;
            break;
        case "←":
            newPosition = currentPosition - 1;
            break;
    }
    return newPosition;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


