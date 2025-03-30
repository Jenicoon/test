const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const image = document.getElementById("image");
const timerElement = document.getElementById("timer");

let timeLeft = 15;
let timer;
let isDrawing = false;
let timerStarted = false;
let imageLoaded = false;

function drawBackground() {
    const img = new Image();
    img.src = 'Frame.png';
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        imageLoaded = true;
    };
}

function startTimer() {
    if (timerStarted) return;
    timerStarted = true;
    startButton.style.display = "none";
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            canvas.style.pointerEvents = "none";
            image.style.visibility = "hidden";
        }
    }, 1000);
}

function resetCanvas() {
    clearInterval(timer);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    timeLeft = 15;
    timerElement.textContent = timeLeft;
    canvas.style.pointerEvents = "auto";
    startButton.style.display = "inline-block";
    image.style.visibility = "visible";
    timerStarted = false;

    drawBackground();
}

function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
}

canvas.addEventListener("mousedown", (event) => {
    if (!timerStarted || !imageLoaded) return;
    isDrawing = true;
    const pos = getMousePos(event);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});

canvas.addEventListener("mouseup", () => isDrawing = false);

canvas.addEventListener("mousemove", (event) => {
    if (!isDrawing || !imageLoaded) return;
    const pos = getMousePos(event);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});

function getTouchPos(event) {
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    return {
        x: (touch.clientX - rect.left) * (canvas.width / rect.width),
        y: (touch.clientY - rect.top) * (canvas.height / rect.height)
    };
}

canvas.addEventListener("touchstart", (event) => {
    if (!timerStarted || !imageLoaded) return;
    event.preventDefault();
    isDrawing = true;
    const pos = getTouchPos(event);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});

canvas.addEventListener("touchend", () => {
    isDrawing = false;
});

canvas.addEventListener("touchmove", (event) => {
    if (!isDrawing || !imageLoaded) return;
    event.preventDefault();
    const pos = getTouchPos(event);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});

startButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetCanvas);

window.onload = drawBackground;
