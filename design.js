const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("color");
const brushSize = document.getElementById("brushSize");
const templateSelect = document.getElementById("templateSelect");

const penBtn = document.getElementById("penBtn");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

let drawing = false;
let erasing = false;
let template = "blank";

let savedDrawing = document.createElement("canvas");
savedDrawing.width = canvas.width;
savedDrawing.height = canvas.height;

function getPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function drawTemplate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#8d8294";
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.beginPath();

    if (template === "shirt") {
        ctx.moveTo(350, 180);
        ctx.lineTo(270, 220);
        ctx.lineTo(190, 340);
        ctx.lineTo(270, 390);
        ctx.lineTo(310, 330);
        ctx.lineTo(310, 470);
        ctx.lineTo(590, 470);
        ctx.lineTo(590, 330);
        ctx.lineTo(630, 390);
        ctx.lineTo(710, 340);
        ctx.lineTo(630, 220);
        ctx.lineTo(550, 180);
        ctx.lineTo(510, 220);
        ctx.lineTo(390, 220);
        ctx.closePath();
    }

    else if (template === "crop") {
        ctx.moveTo(350, 180);
        ctx.lineTo(270, 220);
        ctx.lineTo(210, 330);
        ctx.lineTo(290, 370);
        ctx.lineTo(330, 320);
        ctx.lineTo(330, 390);
        ctx.lineTo(570, 390);
        ctx.lineTo(570, 320);
        ctx.lineTo(610, 370);
        ctx.lineTo(690, 330);
        ctx.lineTo(630, 220);
        ctx.lineTo(550, 180);
        ctx.lineTo(510, 220);
        ctx.lineTo(390, 220);
        ctx.closePath();
    }

    else if (template === "tank") {
        ctx.moveTo(370, 160);
        ctx.lineTo(330, 280);
        ctx.lineTo(330, 460);
        ctx.lineTo(570, 460);
        ctx.lineTo(570, 280);
        ctx.lineTo(530, 160);
        ctx.lineTo(470, 160);
        ctx.lineTo(450, 260);
        ctx.lineTo(430, 160);
        ctx.closePath();
    }

    else if (template === "halter") {
        ctx.moveTo(450, 150);
        ctx.lineTo(350, 260);
        ctx.lineTo(330, 460);
        ctx.lineTo(570, 460);
        ctx.lineTo(550, 260);
        ctx.closePath();
        ctx.moveTo(450, 150);
        ctx.lineTo(450, 260);
    }

    else if (template === "offshoulder") {
        ctx.moveTo(300, 230);
        ctx.lineTo(380, 190);
        ctx.lineTo(520, 190);
        ctx.lineTo(600, 230);
        ctx.lineTo(650, 350);
        ctx.lineTo(580, 390);
        ctx.lineTo(550, 340);
        ctx.lineTo(550, 470);
        ctx.lineTo(350, 470);
        ctx.lineTo(350, 340);
        ctx.lineTo(320, 390);
        ctx.lineTo(250, 350);
        ctx.closePath();
    }

    else if (template === "dress") {
        ctx.moveTo(390, 150);
        ctx.lineTo(350, 220);
        ctx.lineTo(300, 250);
        ctx.lineTo(220, 480);
        ctx.lineTo(680, 480);
        ctx.lineTo(600, 250);
        ctx.lineTo(550, 220);
        ctx.lineTo(510, 150);
        ctx.lineTo(470, 240);
        ctx.lineTo(430, 240);
        ctx.closePath();
    }

    else if (template === "pants") {
        ctx.moveTo(330, 150);
        ctx.lineTo(570, 150);
        ctx.lineTo(590, 480);
        ctx.lineTo(480, 480);
        ctx.lineTo(450, 280);
        ctx.lineTo(420, 480);
        ctx.lineTo(310, 480);
        ctx.closePath();
    }

    else if (template === "jacket") {
        ctx.moveTo(350, 160);
        ctx.lineTo(270, 210);
        ctx.lineTo(190, 350);
        ctx.lineTo(270, 400);
        ctx.lineTo(320, 320);
        ctx.lineTo(320, 490);
        ctx.lineTo(580, 490);
        ctx.lineTo(580, 320);
        ctx.lineTo(630, 400);
        ctx.lineTo(710, 350);
        ctx.lineTo(630, 210);
        ctx.lineTo(550, 160);
        ctx.lineTo(500, 220);
        ctx.lineTo(400, 220);
        ctx.closePath();
        ctx.moveTo(450, 220);
        ctx.lineTo(450, 490);
    }

    else {
        return;
    }

    ctx.stroke();
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(savedDrawing, 0, 0);
    drawTemplate();
}

function startDrawing(event) {
    drawing = true;
    canvas.setPointerCapture(event.pointerId);

    const pos = getPosition(event);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

canvas.addEventListener("pointerdown", startDrawing);

canvas.addEventListener("pointermove", (event) => {
    if (!drawing) return;

    const pos = getPosition(event);

    ctx.strokeStyle = erasing ? "#ffffff" : colorPicker.value;
    ctx.lineWidth = brushSize.value;
    ctx.lineCap = "round";

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
});

function stopDrawing() {
    if (!drawing) return;

    drawing = false;
    ctx.beginPath();

    savedDrawing.getContext("2d").clearRect(
        0, 0, savedDrawing.width, savedDrawing.height
    );
    savedDrawing.getContext("2d").drawImage(canvas, 0, 0);
    drawTemplate();
}

canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointercancel", stopDrawing);
canvas.addEventListener("lostpointercapture", stopDrawing);

penBtn.addEventListener("click", () => {
    erasing = false;
    penBtn.classList.add("active");
    eraserBtn.classList.remove("active");
});

eraserBtn.addEventListener("click", () => {
    erasing = true;
    eraserBtn.classList.add("active");
    penBtn.classList.remove("active");
});

clearBtn.addEventListener("click", () => {
    if (confirm("Clear your design?")) {
        savedDrawing.getContext("2d").clearRect(
            0, 0, savedDrawing.width, savedDrawing.height
        );
        redraw();
    }
});

templateSelect.addEventListener("change", () => {
    template = templateSelect.value;
    redraw();
});

saveBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "moonshine-fashion-design.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});
