const orientations = ["↑", "→", "↓", "←"];
const white = "rgb(255, 255, 255)";
const black = "rgb(0, 0, 0)";
let rows;
let cancelTime;

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
        setArrow(this.currentPosition, this.prevPosition, this.currentOrientation, currentColor);
        this.currentOrientation = changeOrientation(this.currentOrientation, currentColor);
        this.prevPosition = this.currentPosition;
        switchColor(this.currentPosition, currentColor);
        this.currentPosition = changePosition(this.currentPosition, this.currentOrientation);
        this.steps++;
    }
};

//  Generate the grid
function genGrid(n) {
    const gridContainer = document.getElementById("grid-container");
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
}

//  Main loop
async function run() {
    rows = parseInt(document.getElementById("grid-size").value);
    genGrid(rows);
    ant.initialize(rows);
    if (cancelTime) await sleep(cancelTime);  // run out the remaining sleep time when re-generating the simulation
    while (ant.currentPosition > 0 && ant.currentPosition < rows*rows) {
        ant.move();
        const currentColor = getComputedStyle(document.getElementById(ant.currentPosition.toString())).backgroundColor;
        console.log(`Taking step #${ant.steps}. Current color: ${currentColor}, orientation: ${ant.currentOrientation}, position: ${ant.currentPosition}`);
        await sleep(1000);
        cancelTime = new Date().getTime();
    }
}

//  Switch the background color of a cell from white > black and vice versa
function switchColor(currentPosition, currentColor) {
    currentPosition = currentPosition.toString();
    if (currentColor === white) {
        document.getElementById(currentPosition).style.backgroundColor = black;
    } else {
        document.getElementById(currentPosition).style.backgroundColor = white;
    }
}

//  Sets the arrow icon indicating direction of next move
function setArrow(currentPosition, prevPosition, currentOrientation, currentColor) {
    document.getElementById(currentPosition.toString()).innerText = currentOrientation;
    if (currentColor === white) {
        document.getElementById(currentPosition).style.color = white;
    } else {
        document.getElementById(currentPosition).style.color = black;
    }
    if (ant.steps > 0) {
        document.getElementById(prevPosition.toString()).innerText = "";
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


