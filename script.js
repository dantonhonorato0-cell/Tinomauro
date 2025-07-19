const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ajusta o tamanho do canvas para a tela inteira
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Imagens
const tinomauroImg = new Image();
tinomauroImg.src = "https://i.imgur.com/A6pH6aL.png"; // personagem

const coracaoImg = "https://i.imgur.com/o3hSgVg.png";

const estalactiteImg = new Image();
estalactiteImg.src = "https://i.imgur.com/v3kOjXd.png";

const estalagmiteImg = new Image();
estalagmiteImg.src = "https://i.imgur.com/JF69YvV.png";

// Variáveis do personagem
const player = {
  x: 50,
  y: canvas.height - 150, // no chão
  width: 80,
  height: 80,
  dy: 0,
  gravity: 0.8,
  jumpForce: -15,
  onGround: true,
  lives: 3,
  alive: true
};

// Obstáculos
const estalactites = [];
const estalagmites = [];

// Controle de tempo para criação de obstáculos
let estalactiteTimer = 0;
let estalagmiteTimer = 0;
const obstacleInterval = 150; // frames

// Score
let score = 0;

// Controle de input para pular
window.addEventListener("keydown", e => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    jump();
  }
});
window.addEventListener("touchstart", e => {
  jump();
});

function jump() {
  if (player.onGround && player.alive) {
    player.dy = player.jumpForce;
    player.onGround = false;
  }
}

// Função para criar obstáculos (estalactites e estalagmites)
function criarEstalactite() {
  estalactites.push({
    x: canvas.width,
    y: 0,
    width: 60,
    height: 100,
    speed: 6
  });
}

function criarEstalagmite() {
  estalagmites.push({
    x: canvas.width,
    y: canvas.height - 80,
    width: 60,
    height: 80,
    speed: 6
  });
}

// Função para detectar colisão
function colisao(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.height + rect1.y > rect2.y
  );
}

// Função principal do jogo
function update() {
  if (!player.alive) {
    drawGameOver();
    return;
  }

  // Limpa a tela
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Atualiza gravidade
  player.dy += player.gravity;
  player.y += player.dy;

  // Checa se está no chão
  if (player.y + player.height >= canvas.height - 50) {
    player.y = canvas.height - 50 - player.height;
    player.dy = 0;
    player.onGround = true;
  }

  // Desenha o personagem
  ctx.drawImage(tinomauroImg, player.x, player.y, player.width, player.height);

  // Cria obstáculos
  estalactiteTimer++;
  estalagmiteTimer++;

  if (estalactiteTimer > obstacleInterval) {
    criarEstalactite();
    estalactiteTimer = 0;
  }

  if (estalagmiteTimer > obstacleInterval + 75) {
    criarEstalagmite();
    estalagmiteTimer = 0;
  }

  // Atualiza e desenha estalactites
  for (let i = estalactites.length - 1; i >= 0; i--) {
    const e = estalactites[i];
    e.x -= e.speed;

    ctx.drawImage(estalactiteImg, e.x, e.y, e.width, e.height);

    if (colisao(player, e)) {
      estalactites.splice(i, 1);
      perderVida();
    } else if (e.x + e.width < 0) {
      estalactites.splice(i, 1);
      score++;
    }
  }

  // Atualiza e desenha estalagmites
  for (let i = estalagmites.length - 1; i >= 0; i--) {
    const e = estalagmites[i];
    e.x -= e.speed;

    ctx.drawImage(estalagmiteImg, e.x, e.y, e.width, e.height);

    if (colisao(player, e)) {
      estalagmites.splice(i, 1);
      perderVida();
    } else if (e.x + e.width < 0) {
      estalagmites.splice(i, 1);
      score++;
    }
  }

  // Desenha vidas
  desenharVidas();

  // Desenha score
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 130, 40);

  // Próximo frame
  requestAnimationFrame(update);
}

function perderVida() {
  player.lives--;
  if (player.lives <= 0) {
    player.alive = false;
  }
}

function desenharVidas() {
  const vidasDiv = document.getElementById("vidas");
  vidasDiv.innerHTML = "";
  for (let i = 0; i < player.lives; i++) {
    const img = document.createElement("img");
    img.src = coracaoImg;
    img.className = "vida";
    vidasDiv.appendChild(img);
  }
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  ctx.font = "24px Arial";
  ctx.fillText(`Score final: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
}

// Começa o jogo quando as imagens carregarem
tinomauroImg.onload = () => {
  estalactiteImg.onload = () => {
    estalagmiteImg.onload = () => {
      update();
    };
  };
};
