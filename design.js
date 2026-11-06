const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("color");
const brushSize = document.getElementById("brushSize");

const penBtn = document.getElementById("penBtn");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

let drawing = false;
let erasing = false;

ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = colorPicker.value;
ctx.lineWidth = brushSize.value;

// Get the correct canvas position
function getPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
}

// Start drawing
canvas.addEventListener("pointerdown", (event) => {
    drawing = true;
    canvas.setPointerCapture(event.pointerId);

    const pos = getPosition(event);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(pos.x + 0.1, pos.y + 0.1);
    ctx.stroke();
});

// Draw while moving
canvas.addEventListener("pointermove", (event) => {
    if (!drawing) return;

    const pos = getPosition(event);

    ctx.strokeStyle = erasing ? "#ffffff" : colorPicker.value;
    ctx.lineWidth = brushSize.value;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
});

// Stop drawing
function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointercancel", stopDrawing);
canvas.addEventListener("lostpointercapture", stopDrawing);

// Pen button
penBtn.addEventListener("click", () => {
    erasing = false;
    penBtn.classList.add("active");
    eraserBtn.classList.remove("active");
});

// Eraser button
eraserBtn.addEventListener("click", () => {
    erasing = true;
    eraserBtn.classList.add("active");
    penBtn.classList.remove("active");
});

// Clear canvas
clearBtn.addEventListener("click", () => {
    const confirmClear = confirm("Clear your entire design?");

    if (confirmClear) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

// Save design
saveBtn.addEventListener("click", () => {
    const link = document.createElement("a");

    link.download = "moonshine-fashion-design.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});
