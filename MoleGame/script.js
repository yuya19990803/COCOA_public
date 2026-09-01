const board = document.getElementById("game-board");
const scoreText = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");
const restartBtn = document.getElementById("restart-btn");
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const timerText = document.getElementById("timer");
const rankName = document.getElementById("rank-name");
const rankImage = document.getElementById("rank-image");
const rankMessage = document.getElementById("rank-message");
const countdownText =
    document.getElementById("countdown");

let timeLeft = 30;
let countdownTimer;

let score = 0;
let currentMole = null;
let currentOyaji = null;
let gameOver = false;

let moleTimer;
let oyajiTimer;

const cells = [];

/* ------------------------
   マス作成
------------------------ */

for (let i = 0; i < 15; i++) {

    const cell = document.createElement("div");
    cell.className = "cell";

    const hole = document.createElement("img");
    hole.src = "images/Hole.png";
    hole.className = "hole";

    const mole = document.createElement("img");
    mole.src = "images/Mole.png";
    mole.className = "character mole";

    const oyaji = document.createElement("img");
    oyaji.src = "images/oyaji.png";
    oyaji.className = "character oyaji";

    cell.appendChild(hole);
    cell.appendChild(mole);
    cell.appendChild(oyaji);

    board.appendChild(cell);

    cells.push({
        cell,
        mole,
        oyaji
    });

    cell.addEventListener("click", () => hit(i));
}

/* ------------------------
   モグラ出現
------------------------ */

function moveMole() {

    if (gameOver) return;

    cells.forEach(cell => {
        cell.mole.classList.remove("show");
    });

    currentMole = Math.floor(Math.random() * 15);

    if (currentMole === currentOyaji) return;

    cells[currentMole].mole.classList.add("show");
}

/* ------------------------
   おじさん出現
------------------------ */

function spawnOyaji() {

    if (gameOver) return;

    cells.forEach(cell => {
        cell.oyaji.classList.remove("show");
    });

    currentOyaji = Math.floor(Math.random() * 15);

    while (currentOyaji === currentMole) {
        currentOyaji = Math.floor(Math.random() * 15);
    }

    cells[currentOyaji].oyaji.classList.add("show");
}

/* ------------------------
   クリック判定
------------------------ */

function hit(index) {

    if (gameOver) return;

    if (index === currentMole) {

        score++;

        scoreText.textContent = `Score : ${score}`;

        cells[index].mole.classList.remove("show");
    }

    else if (index === currentOyaji) {

        gameOver = true;

        clearInterval(moleTimer);
        clearInterval(oyajiTimer);
        clearInterval(countdownTimer);

        cells.forEach(cell => {
            cell.mole.classList.remove("show");
            cell.oyaji.classList.remove("show");
        });

        rankMessage.textContent = "ゲームオーバー";

        rankName.textContent = "";

        rankImage.src = "images/oyaji_namida.png";

        gameOverScreen.classList.remove("hidden");
    }
}

/* ------------------------
   ゲーム開始
------------------------ */

function startGame() {

    moleTimer = setInterval(moveMole, 1000);

    oyajiTimer = setInterval(spawnOyaji, 5000);

    countdownTimer = setInterval(updateTimer, 1000);
}

/* ------------------------
   リスタート
------------------------ */

function restartGame() {
    clearInterval(countdownTimer);
    timeLeft = 30;

timerText.textContent =
    "残り時間 : 30";
    score = 0;
    currentMole = null;
    currentOyaji = null;
    gameOver = false;

    scoreText.textContent = "Score : 0";

    cells.forEach(cell => {
        cell.mole.classList.remove("show");
        cell.oyaji.classList.remove("show");
    });

    gameOverScreen.classList.add("hidden");

startScreen.classList.remove("hidden");

startBtn.style.display = "block";

countdownText.textContent = "";

}

function updateTimer() {

    timeLeft--;

    timerText.textContent =
        `残り時間 : ${timeLeft}`;

    if(timeLeft <= 0){

        clearInterval(moleTimer);
        clearInterval(oyajiTimer);
        clearInterval(countdownTimer);

        gameOver = true;

        if (score <= 5) {
            rankName.textContent = "初心者モグラハンター";
            rankImage.src = "images/初心者モグラハンター.png";
        }
        else if (score <= 15) {
            rankName.textContent = "モグラ探検隊";
            rankImage.src = "images/モグラ探検隊.png";
        }
        else if (score <= 25) {
            rankName.textContent = "モグラ研究員";
            rankImage.src = "images/モグラ研究員.png";
        }
        else {
            rankName.textContent = "モグラ博士Ω";
            rankImage.src = "images/モグラ博士Ω.png";
        }

        gameOverScreen.classList.remove("hidden");
    }
}


/* ------------------------
   ボタン
------------------------ */

restartBtn.addEventListener("click", restartGame);

/* ------------------------
   初回起動
------------------------ */

startBtn.addEventListener("click", () => {

    startBtn.style.display = "none";

    let count = 3;

    countdownText.textContent = count;

    const countdown = setInterval(() => {

        count--;

        if (count > 0) {

            countdownText.textContent = count;

        }

        else {

            clearInterval(countdown);

            countdownText.textContent = "スタート！";

            setTimeout(() => {

                startScreen.classList.add("hidden");

                startGame();

            }, 1000);
        }

    }, 1000);

});