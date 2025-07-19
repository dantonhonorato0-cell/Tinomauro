const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ajusta o tamanho do canvas para a tela inteira
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Imagens
const tinomauroImg = new Image();
tinomauroImg.src = "https://i.imgur.com/A6pH6aL.png"; // personagem
const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

// Imagens
const coracaoImg = new Image();
coracaoImg.src = "imagens/coracao.png";

const estalactiteImg = new Image();
estalactiteImg.src = "imagens/estalactite.png";

const estalagmiteImg = new Image();
estalagmiteImg.src = "imagens/estalagmite.png";

function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Coração no canto
  ctx.drawImage(coracaoImg, 10, 10, 30, 30);

  // Estalactite no topo
  ctx.drawImage(estalactiteImg, 100, 0, 50, 100);

  // Estalagmite no chão
  ctx.drawImage(estalagmiteImg, 200, canvas.height - 100, 50, 100);
}

setInterval(desenhar, 1000 / 60);
