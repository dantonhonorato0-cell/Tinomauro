const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameRunning = false;
let gravity = 0.6;
let jumpStrength = -10;
let velocityY = 0;
let playerY = canvas.height - 100;
let lives = 3;
let obstacles = [];
let frame = 0;

let heartImg = new Image();
heartImg.src = "imagens/coracao.png";

let dinoImg = new Image();
dinoImg.src = "imagens/personagem.png";

let stalactiteImg = new Image();
stalactiteImg.src = "imagens/estalactite.png";

let stalagmiteImg = new Image();
stalagmiteImg.src = "imagens/estalagmite.png";

document.getElementById("startButton").onclick = () => {
  document.getElementById("menu").style.display = "none";
  resetGame();
  gameRunning = true;
  requestAnimationFrame(update);
};

function resetGame() {
  lives = 3;
  playerY = canvas.height - 100;
  velocityY = 0;
  obstacles = [];
  frame = 0;
}

function drawPlayer() {
  ctx.drawImage(dinoImg, 50, playerY, 50, 50);
}

function drawLives() {
  for (let i = 0; i < lives; i++) {
    ctx.drawImage(heartImg, 10 + i * 30, 10, 20, 20);
  }
}

function spawnObstacles() {
  if (frame % 90 === 0) {
    let isTop = Math.random() < 0.5;
    obstacles.push({
      x: canvas.width,
      y: isTop ? 0 : canvas.height - 50,
      top: isTop
    });
  }
}

function drawObstacles() {
  for (let obs of obstacles) {
    let img = obs.top ? stalactiteImg : stalagmiteImg;
    ctx.drawImage(img, obs.x, obs.y, 30, 50);
  }
}

function checkCollision() {
  for (let obs of obstacles) {
    if (
      obs.x < 90 &&
      obs.x + 30 > 50 &&
      playerY + 50 > obs.y &&
      playerY < obs.y + 50
    ) {
      obstacles.splice(obstacles.indexOf(obs), 1);
      lives--;
      if (lives <= 0) {
        gameOver();
      }
    }
  }
}

function gameOver() {
  gameRunning = false;
  document.getElementById("menu").style.display = "block";
  document.getElementById("menu").innerHTML = "<h1>O Tinomauro foi pá Panguamandape!</h1><button id='startButton'>Jogar</button>";
  document.getElementById("startButton").onclick = () => {
    document.getElementById("menu").style.display = "none";
    resetGame();
    gameRunning = true;
    requestAnimationFrame(update);
  };
}

function update() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  velocityY += gravity;
  playerY += velocityY;

  if (playerY > canvas.height - 100) {
    playerY = canvas.height - 100;
    velocityY = 0;
  }

  drawPlayer();
  drawLives();
  spawnObstacles();

  for (let obs of obstacles) obs.x -= 5;
  drawObstacles();
  checkCollision();

  frame++;
  requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && playerY >= canvas.height - 100) {
    velocityY = jumpStrength;
  }
});
