//#region DOM
var canvas = document.createElement('canvas');

canvas.id = 'morpion';
canvas.width = 500;
canvas.height = 550;
canvas.style.border = '2px solid';


const gameDiv = document.getElementById('content');
gameDiv.appendChild(canvas);

const ctx = canvas.getContext('2d');
ctx.font = "24px serif";

const stop = document.getElementById('stop');
//#endregion

//Constantes
const C_SIZE = 500;
const CASE_SIZE = C_SIZE / 3;
const C_SIZE_OFFSET_TEXT = 35;
const C_SIZE_OFFSET = 50;
const COLOR_BASE = "black";
const COLOR_CURSOR_J1 = "#78a2cc";
const COLOR_CURSOR_J2 = "#db5856";
const COLOR_WHITE = "#ffffff";
const J1 = "X";
const J2 = "O";
const J1_GRID = new Bit();
const J2_GRID = new Bit();
const BLANK = "_";
const BASE_GRID = [BLANK, BLANK, BLANK, BLANK, BLANK, BLANK, BLANK, BLANK, BLANK]

//Variables
let mouse = {
    x: 0,
    y: 0
}

let cursor = {
    x: 0,
    y: 0
}

let j1_playing = true;

let grid = [...BASE_GRID];

let end = false;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    if(end) {
        drawEndLine();
    }
    drawState();
    drawBorders();

    if(!end) {
        drawCursor();
    }
}

function update() {
    calculateCursor();

    end = J1_GRID.win() | J2_GRID.win();
    if(!grid.includes(BLANK) && !end) end = true;
}

async function gameLoop() {
    update();
    draw();
}

function updateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    mouse = {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function click() {
    let i = cursor.x + cursor.y * 3;
    if (grid[i] !== BLANK) return;
    if (j1_playing) {
        grid[i] = J1;
        J1_GRID.set(i);
    }
    else {
        grid[i] = J2;
        J2_GRID.set(i);
    }

    j1_playing = !j1_playing;
}

function init() {
    document.onmousemove = updateMousePos;
    document.onclick = click;

    const reset = document.getElementById("reset");

    reset.addEventListener("click", function () {
        setTimeout(function () {
            j1_playing = true;
            grid = [...BASE_GRID];
            end = false;
            J1_GRID.reset();
            J2_GRID.reset();
        }, 200);
    });

    setInterval(gameLoop, 1); //~1000fps
}

function drawLine(startX, startY, endX, endY, lineWidth = 2) {
    ctx.lineWidth = lineWidth;
    ctx.beginPath(); // Start a new path
    ctx.moveTo(startX, startY); // Move the pen to (30, 50)
    ctx.lineTo(endX, endY); // Draw a line to (150, 100)
    ctx.stroke(); // Render the path
}

function drawBorders() {
    const col1X = CASE_SIZE;
    const col2X = col1X * 2;
    drawLine(col1X, 0, col1X, C_SIZE);
    drawLine(col2X, 0, col2X, C_SIZE);
    const row1Y = CASE_SIZE;
    const row2Y = row1Y * 2;
    drawLine(0, row1Y, C_SIZE, row1Y);
    drawLine(0, row2Y, C_SIZE, row2Y);
    drawLine(0, C_SIZE, C_SIZE, C_SIZE);
}

function drawCursor() {
    ctx.fillStyle = j1_playing ? COLOR_CURSOR_J1 : COLOR_CURSOR_J2;

    const cursorSize = CASE_SIZE;
    ctx.beginPath(); // Start a new path
    ctx.rect(cursor.x * cursorSize, cursor.y * cursorSize, cursorSize, cursorSize); // Add a rectangle to the current path
    ctx.fill(); // Render the path

    ctx.fillStyle = COLOR_BASE;
}

function calculateCursor() {
    let x = Math.min(Math.max(0, mouse.x), C_SIZE);
    let y = Math.min(Math.max(0, mouse.y), C_SIZE);

    let posX = Math.floor(x / CASE_SIZE);
    let posY = Math.floor(y / CASE_SIZE);

    cursor = {
        x: Math.min(2, Math.max(0, posX)),
        y: Math.min(2, Math.max(0, posY))
    }
}

function drawState() {
    ctx.fillStyle = COLOR_WHITE;
    const size = CASE_SIZE;
    ctx.beginPath(); // Start a new path
    ctx.rect(0, C_SIZE, C_SIZE, C_SIZE_OFFSET); // Add a rectangle to the current path
    ctx.fill(); // Render the path
    ctx.fillStyle = COLOR_BASE;

    if (!end) {
        let text = "Joueur 1";
        if (!j1_playing) text = "Joueur 2";
        ctx.fillText(text, C_SIZE_OFFSET_TEXT / 2, C_SIZE + C_SIZE_OFFSET_TEXT);
    }
    else {
        let draw = !grid.includes(BLANK) && !J1_GRID.win() && !J2_GRID.win();
        let text = "Le joueur 1 a gagné";
        if (J2_GRID.win()) {
            text = "Le joueur 2 a gagné";
        } else if (draw) {
            text = "C'est un match nul";
        }
        ctx.fillText(text, C_SIZE_OFFSET_TEXT / 2, C_SIZE + C_SIZE_OFFSET_TEXT);
    }
}

function drawGrid() {
    for (let c = 0; c < 9; c++) {
        if(grid[c] === J1){
            drawCase(c, grid[c]);
        }
    }

    for (let c = 0; c < 9; c++) {
        if(grid[c] === J2){
            drawCase(c, grid[c]);
        }
    }
    
    for (let c = 0; c < 9; c++) {
        if(grid[c] === BLANK){
            drawCase(c, grid[c]);
        }
    }
}

function drawCase(c, s) {
    const y = Math.floor(c / 3);
    const x = c % 3;

    if(s === J1) {
        drawCross(x, y);
    }
    else if(s === J2) {
        drawCircle(x, y);
    }
    else {
        ctx.fillStyle = COLOR_WHITE;
        const size = CASE_SIZE;
        ctx.beginPath(); // Start a new path
        ctx.rect(x * size, y * size, size, size); // Add a rectangle to the current path
        ctx.fill(); // Render the path
    }
    ctx.fillStyle = COLOR_BASE;
}

function drawCross(x, y) {
    ctx.fillStyle = COLOR_WHITE;
    const size = CASE_SIZE;
    ctx.beginPath(); // Start a new path
    ctx.rect(x * size, y * size, size, size); // Add a rectangle to the current path
    ctx.fill(); // Render the path
    ctx.fillStyle = COLOR_BASE;

    ctx.strokeStyle  = COLOR_CURSOR_J1;
    let x1 = x * CASE_SIZE;
    let x2 = x * CASE_SIZE + CASE_SIZE;
    let y1 = y * CASE_SIZE;
    let y2 = y * CASE_SIZE + CASE_SIZE;
    drawLine(x1, y1, x2, y2, 15);

    x1 = x * CASE_SIZE + CASE_SIZE;
    x2 = x * CASE_SIZE;
    y1 = y * CASE_SIZE;
    y2 = y * CASE_SIZE + CASE_SIZE;
    drawLine(x1, y1, x2, y2, 15);
    ctx.strokeStyle = COLOR_BASE;
}

function drawCircle(cx, cy) {
    ctx.fillStyle = COLOR_WHITE;
    const size = CASE_SIZE;
    ctx.beginPath(); // Start a new path
    ctx.rect(cx * size, cy * size, size, size); // Add a rectangle to the current path
    ctx.fill(); // Render the path
    ctx.fillStyle = COLOR_BASE;

    let x = cx * CASE_SIZE + CASE_SIZE / 2;
    let y = cy * CASE_SIZE + CASE_SIZE / 2;

    ctx.strokeStyle  = COLOR_CURSOR_J2;
    ctx.beginPath();
    ctx.arc(x, y, CASE_SIZE / 3, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.strokeStyle = COLOR_BASE;
}

function drawEndLine() {
    let pos = null;
    if(J1_GRID.win()) pos = J1_GRID.winningPosition();
    else pos = J2_GRID.winningPosition();

    if(pos === null) return;

    const sy = Math.floor(pos.s / 3);
    const sx = pos.s % 3;

    const ey = Math.floor(pos.e / 3);
    const ex = pos.e % 3;

    let x1 = sx * CASE_SIZE + ((sx === ex) ? CASE_SIZE / 2 : 0);
    let x2 = ex * CASE_SIZE + ((sx === ex) ? CASE_SIZE / 2 : CASE_SIZE);
    let y1 = sy * CASE_SIZE + ((sy === ey) ? CASE_SIZE / 2 : 0);
    let y2 = ey * CASE_SIZE + ((sy === ey) ? CASE_SIZE / 2 : CASE_SIZE);

    //Diagonales
    if(sx === sy && ex === ey && sx === 0 && ex === 2) {
        x1 = 0;
        x2 = C_SIZE;
        y1 = 0;
        y2 = C_SIZE;
    }
    else if (sx === ey && sy === ex && sx === 0 && sy === 2) {
        x1 = 0;
        x2 = C_SIZE;
        y1 = C_SIZE;
        y2 = 0;
    }

    drawLine(x1, y1, x2, y2, 15);
    ctx.strokeStyle = COLOR_BASE;
}

init();