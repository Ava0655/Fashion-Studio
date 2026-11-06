const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("color");
const brushSize = document.getElementById("brushSize");
const templateSelect = document.getElementById("templateSelect");

const penBtn = document.getElementById("penBtn");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

// Separate layer for the clothing outline
const templateCanvas = document.createElement("canvas");
templateCanvas.width = canvas.width;
templateCanvas.height = canvas.height;

const templateCtx = templateCanvas.getContext("2d");

// Separate layer for the user's artwork
const drawingCanvas = document.createElement("canvas");
drawingCanvas.width = canvas.width;
drawingCanvas.height = canvas.height;

const drawingCtx = drawingCanvas.getContext("2d");

let drawing = false;
let erasing = false;
let template = "blank";

function getPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
}

// Draw clothing outlines
function drawTemplate() {
    templateCtx.clearRect(0, 0, 900, 600);

    templateCtx.strokeStyle = "#8d8294";
    templateCtx.lineWidth = 5;
    templateCtx.lineJoin = "round";
    templateCtx.lineCap = "round";

    templateCtx.beginPath();

    if (template === "shirt") {
        templateCtx.moveTo(350,180);
        templateCtx.lineTo(270,220);
        templateCtx.lineTo(190,340);
        templateCtx.lineTo(270,390);
        templateCtx.lineTo(310,330);
        templateCtx.lineTo(310,470);
        templateCtx.lineTo(590,470);
        templateCtx.lineTo(590,330);
        templateCtx.lineTo(630,390);
        templateCtx.lineTo(710,340);
        templateCtx.lineTo(630,220);
        templateCtx.lineTo(550,180);
        templateCtx.lineTo(510,220);
        templateCtx.lineTo(390,220);
        templateCtx.closePath();
    }

    else if (template === "crop") {
        templateCtx.moveTo(350,180);
        templateCtx.lineTo(270,220);
        templateCtx.lineTo(210,330);
        templateCtx.lineTo(290,370);
        templateCtx.lineTo(330,320);
        templateCtx.lineTo(330,390);
        templateCtx.lineTo(570,390);
        templateCtx.lineTo(570,320);
        templateCtx.lineTo(610,370);
        templateCtx.lineTo(690,330);
        templateCtx.lineTo(630,220);
        templateCtx.lineTo(550,180);
        templateCtx.lineTo(510,220);
        templateCtx.lineTo(390,220);
        templateCtx.closePath();
    }

    else if (template === "tank") {
        templateCtx.moveTo(370,160);
        templateCtx.lineTo(330,280);
        templateCtx.lineTo(330,460);
        templateCtx.lineTo(570,460);
        templateCtx.lineTo(570,280);
        templateCtx.lineTo(530,160);
        templateCtx.lineTo(470,160);
        templateCtx.lineTo(450,260);
        templateCtx.lineTo(430,160);
        templateCtx.closePath();
    }

    else if (template === "halter") {
        templateCtx.moveTo(450,150);
        templateCtx.lineTo(350,260);
        templateCtx.lineTo(330,460);
        templateCtx.lineTo(570,460);
        templateCtx.lineTo(550,260);
        templateCtx.closePath();
        templateCtx.moveTo(450,150);
        templateCtx.lineTo(450,260);
    }

    else if (template === "offshoulder") {
        templateCtx.moveTo(300,230);
        templateCtx.lineTo(380,190);
        templateCtx.lineTo(520,190);
        templateCtx.lineTo(600,230);
        templateCtx.lineTo(650,350);
        templateCtx.lineTo(580,390);
        templateCtx.lineTo(550,340);
        templateCtx.lineTo(550,470);
        templateCtx.lineTo(350,470);
        templateCtx.lineTo(350,340);
        templateCtx.lineTo(320,390);
        templateCtx.lineTo(250,350);
        templateCtx.closePath();
    }

    else if (template === "dress") {
        templateCtx.moveTo(390,150);
        templateCtx.lineTo(350,220);
        templateCtx.lineTo(300,250);
        templateCtx.lineTo(220,480);
        templateCtx.lineTo(680,480);
        templateCtx.lineTo(600,250);
        templateCtx.lineTo(550,220);
        templateCtx.lineTo(510,150);
        templateCtx.lineTo(470,240);
        templateCtx.lineTo(430,240);
        templateCtx.closePath();
    }

    else if (template === "pants") {
        templateCtx.moveTo(330,150);
        templateCtx.lineTo(570,150);
        templateCtx.lineTo(590,480);
        templateCtx.lineTo(480,480);
        templateCtx.lineTo(450,280);
        templateCtx.lineTo(420,480);
        templateCtx.lineTo(310,480);
        templateCtx.closePath();
    }

    else if (template === "jacket") {
        templateCtx.moveTo(350,160);
        templateCtx.lineTo(270,210);
        templateCtx.lineTo(190,350);
        templateCtx.lineTo(270,400);
        templateCtx.lineTo(320,320);
        templateCtx.lineTo(320,490);
        templateCtx.lineTo(580,490);
        templateCtx.lineTo(580,320);
        templateCtx.lineTo(630,400);
        templateCtx.lineTo(710,350);
        templateCtx.lineTo(630,210);
        templateCtx.lineTo(550,160);
        templateCtx.lineTo(500,220);
        templateCtx.lineTo(400,220);
        templateCtx.closePath();
        templateCtx.moveTo(450,220);
        templateCtx.lineTo(450,490);
    }

    templateCtx.stroke();
}

// Display both layers
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(templateCanvas, 0, 0);
    ctx.drawImage(drawingCanvas, 0, 0);
}

// Start drawing
canvas.addEventListener("pointerdown", (event) => {
    drawing = true;
    canvas.setPointerCapture(event.pointerId);

    const pos = getPosition(event);

    drawingCtx.beginPath();
    drawingCtx.moveTo(pos.x, pos.y);
});

// Draw
canvas.addEventListener("pointermove", (event) => {
    if (!drawing) return;

    const pos = getPosition(event);

    drawingCtx.strokeStyle = erasing ? "#ffffff" : colorPicker.value;
    drawingCtx.lineWidth = brushSize.value;
    drawingCtx.lineCap = "round";
    drawingCtx.lineJoin = "round";

    drawingCtx.lineTo(pos.x, pos.y);
    drawingCtx.stroke();

    redraw();
});

// Stop drawing
function stopDrawing() {
    drawing = false;
    drawingCtx.beginPath();
}

canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointercancel", stopDrawing);
canvas.addEventListener("lostpointercapture", stopDrawing);

// Pen
penBtn.addEventListener("click", () => {
    erasing = false;
    penBtn.classList.add("active");
    eraserBtn.classList.remove("active");
});

// Eraser
eraserBtn.addEventListener("click", () => {
    erasing = true;
    eraserBtn.classList.add("active");
    penBtn.classList.remove("active");
});

// Clear artwork
clearBtn.addEventListener("click", () => {
    if (confirm("Clear your drawing?")) {
        drawingCtx.clearRect(0, 0, 900, 600);
        redraw();
    }
});

// Change clothing template
templateSelect.addEventListener("change", () => {
    template = templateSelect.value;
    drawTemplate();
    redraw();
});

// Save artwork and template together
saveBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "moonshine-fashion-design.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});

// Initial display
drawTemplate();
redraw();
