const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const hud = document.getElementById('hud');
const vidasDiv = document.getElementById('vidas');

let gameRunning = false;
let gravity = 0.6;
let jumpForce = -12;
let groundY = 280; // chão onde o personagem fica

// Imagens
const tinomauroImg = new Image();
tinomauroImg.src = 'imagens/tinomauro.png';

const coracaoImg = new Image();
coracaoImg.src = 'imagens/coracao.png';

const estalactiteImg = new Image();
estalactiteImg.src = 'imagens/estalactite.png';

const estalagmitaImg = new Image();
estalagmitaImg.src = 'imagens/estalagmita.png';

// Personagem
let tinomauro = {
  x: 50,
  y: groundY,
  width: 50,
  height: 50,
  vy: 0,
  onGround: true,
  vidas: 3
};

// Obstáculos
let estalactites = [];
let estalagmites = [];
let obstaculoWidth = 40;
let obstaculoHeight = 50;
let obstaculoSpeed = 3;

// Criar obstáculos iniciais
function criarObstaculos() {
  estalactites = [
    {x: 600, y: 0},
    {x: 900, y: 0},
    {x: 1200, y: 0}
  ];
  estalagmites = [
    {x: 750, y: groundY + obstaculoHeight - 10},
    {x: 1050, y: groundY + obstaculoHeight - 10},
    {x: 1350, y: groundY + obstaculoHeight - 10}
  ];
}

// Função para desenhar vidas
function desenharVidas() {
  vidasDiv.innerHTML = '';
  for(let i = 0; i < tinomauro.vidas; i++) {
    const vida = document.createElement('img');
    vida.src = 'imagens/coracao.png';
    vidasDiv.appendChild(vida);
  }
}

// Controle do pulo
function pular() {
  if (tinomauro.onGround) {
    tinomauro.vy = jumpForce;
    tinomauro.onGround = false;
  }
}

function colidiu(rect1, rect2) {
  return (
    rect1.x < rect2.x + obstaculoWidth &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + obstaculoHeight &&
    rect1.y + rect1.height > rect2.y
  );
}

// Game over
function gameOver() {
  alert('Game Over! Você perdeu todas as vidas.');
  resetGame();
}

// Resetar jogo
function resetGame() {
  tinomauro.vidas = 3;
  tinomauro.x = 50;
  tinomauro.y = groundY;
  tinomauro.vy = 0;
  tinomauro.onGround = true;
  criarObstaculos();
  desenharVidas();
  gameRunning = false;
  canvas.style.display = 'none';
  hud.style.display = 'none';
  startScreen.style.display = 'block';
}

// Atualizar game
function atualizar() {
  if (!gameRunning) return;

  // Atualiza posição do tinomauro
  tinomauro.vy += gravity;
  tinomauro.y += tinomauro.vy;

  if (tinomauro.y >= groundY) {
    tinomauro.y = groundY;
    tinomauro.vy = 0;
    tinomauro.onGround = true;
  }

  // Mover obstáculos para esquerda
  estalactites.forEach((obs) => {
    obs.x -= obstaculoSpeed;
    if (obs.x + obstaculoWidth < 0) obs.x = canvas.width + Math.random() * 300 + 100;
  });

  estalagmites.forEach((obs) => {
    obs.x -= obstaculoSpeed;
    if (obs.x + obstaculoWidth < 0) obs.x = canvas.width + Math.random() * 300 + 100;
  });

  // Checar colisões
  estalactites.forEach((obs) => {
    if (colidiu(tinomauro, obs)) {
      reduzirVida();
      obs.x = canvas.width + Math.random() * 300 + 100;
    }
  });

  estalagmites.forEach((obs) => {
    if (colidiu(tinomauro, obs)) {
      reduzirVida();
      obs.x = canvas.width + Math.random() * 300 + 100;
    }
  });

  desenhar();
  requestAnimationFrame(atualizar);
}

function reduzirVida() {
  tinomauro.vidas--;
  desenharVidas();
  if (tinomauro.vidas <= 0) {
    gameOver();
  }
}

// Desenhar tudo
function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha chão
  ctx.fillStyle = '#4a3c31';
  ctx.fillRect(0, groundY + tinomauro.height, canvas.width, canvas.height - groundY);

  // Desenha estalactites (teto)
  estalactites.forEach((obs) => {
    ctx.drawImage(estalactiteImg, obs.x, obs.y, obstaculoWidth, obstaculoHeight);
  });

  // Desenha estalagmites (chão)
  estalagmites.forEach((obs) => {
    ctx.drawImage(estalagmitaImg, obs.x, obs.y, obstaculoWidth, obstaculoHeight);
  });

  // Desenha tinomauro
  ctx.drawImage(tinomauroImg, tinomauro.x, tinomauro.y, tinomauro.width, tinomauro.height);
}

// Eventos
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    pular();
  }
});
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  pular();
});

// Start do jogo
startButton.addEventListener('click', () => {
  startScreen.style.display = 'none';
  canvas.style.display = 'block';
  hud.style.display = 'block';
  gameRunning = true;
  criarObstaculos();
  desenharVidas();
  atualizar();
});

// Inicializar
resetGame();
