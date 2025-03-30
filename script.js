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
let imageLoaded = false; // 이미지 로드 상태 추적

// 배경 이미지 그리기 (Frame.png)
function drawBackground() {
    const img = new Image();
    img.src = 'Frame.png';  // 이미지 경로 수정
    img.onload = () => {
        // 캔버스 크기를 이미지 크기에 맞추기
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);  // 이미지 캔버스에 그리기
        imageLoaded = true;  // 이미지 로드 완료
    };
}

// 타이머 시작 함수
function startTimer() {
    if (timerStarted) return;
    timerStarted = true;
    startButton.style.display = "none";  // 시작 버튼 숨기기
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            canvas.style.pointerEvents = "none";  // 캔버스 그리기 금지
            image.style.visibility = "hidden";  // 이미지 숨기기
        }
    }, 1000);
}

// 캔버스 초기화 및 리셋
function resetCanvas() {
    clearInterval(timer);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    timeLeft = 15;
    timerElement.textContent = timeLeft;
    canvas.style.pointerEvents = "auto";  // 캔버스 다시 활성화
    startButton.style.display = "inline-block";  // 시작 버튼 다시 보이기
    image.style.visibility = "visible";  // 이미지 보이기
    timerStarted = false;

    // 배경 이미지 다시 그리기
    drawBackground();
}

// 마우스 위치 가져오기
function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
}

// 마우스 이동 시 그리기
canvas.addEventListener("mousedown", (event) => {
    if (!timerStarted || !imageLoaded) return;  // 타이머 시작되고 이미지가 로드된 후에만 그리기 시작
    isDrawing = true;
    const pos = getMousePos(event);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});

// 그리기 종료
canvas.addEventListener("mouseup", () => isDrawing = false);

// 마우스 이동 시 그리기
canvas.addEventListener("mousemove", (event) => {
    if (!isDrawing || !imageLoaded) return;  // 이미지가 로드되지 않으면 그리지 않음
    const pos = getMousePos(event);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "black";  // 선 색상 (검정색)
    ctx.lineWidth = 3;  // 선 두께
    ctx.lineCap = "round";  // 선 끝 모양
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});

// 터치 시작
canvas.addEventListener("touchstart", (event) => {
    if (!timerStarted || !imageLoaded) return;
    event.preventDefault();
    isDrawing = true;
    const pos = getMousePos(event);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});

// 터치 종료
canvas.addEventListener("touchend", () => isDrawing = false);

// 터치 이동 시 그리기
canvas.addEventListener("touchmove", (event) => {
    if (!isDrawing || !imageLoaded) return;
    event.preventDefault();
    const pos = getMousePos(event);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "white";  // 선 색상 (검정색)
    ctx.lineWidth = 3;  // 선 두께
    ctx.lineCap = "round";  // 선 끝 모양
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});

// 버튼 클릭 이벤트
startButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetCanvas);

// 페이지가 로드될 때 배경 이미지 그리기
window.onload = drawBackground;
