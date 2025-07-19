const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Imagens
const coracaoImg = new Image();
coracaoImg.src = 'imagens/coracao.png';

const estalactiteImg = new Image();
estalactiteImg.src = 'imagens/estalactite.png';

const estalagmitaImg = new Image();
estalagmitaImg.src = 'imagens/estalagmita.png';

const tinomauroImg = new Image();
tinomauroImg.src = 'imagens/tinomauro.png';

// Game variables
let vidas = 3;
let gameOver = false;

const GRAVIDADE = 0.6;
const PULO = -12;

// Personagem
const player = {
    x: 100,
    y: 300,
    width: 50,
    height: 70,
    vy: 0,
    noChao: false,
    vidas: vidas,
};

// Estalactites e estalagmites (obstáculos)
const estalactites = [
    { x: 400, y: 0, width: 50, height: 60 },
    { x: 650, y: 0, width: 50, height: 60 },
];

const estalagmites = [
    { x: 520, y: 340, width: 50, height: 60 },
    { x: 750, y: 340, width: 50, height: 60 },
];

// Atualiza as vidas na tela
function atualizarVidas() {
    const vidasDiv = document.getElementById('vidas');
    vidasDiv.innerHTML = '';
    for(let i = 0; i < player.vidas; i++) {
        const img = document.createElement('img');
        img.src = 'imagens/coracao.png';
        img.style.width = '30px';
        img.style.marginRight = '5px';
        vidasDiv.appendChild(img);
    }
}

// Detecta colisão entre retângulos
function colisao(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// Atualiza o jogo a cada frame
function atualizar() {
    if(gameOver) return;

    // Física do pulo e gravidade
    player.vy += GRAVIDADE;
    player.y += player.vy;

    // Chão (fixo em y = 370)
    if(player.y + player.height >= 370) {
        player.y = 370 - player.height;
        player.vy = 0;
        player.noChao = true;
    } else {
        player.noChao = false;
    }

    // Verifica colisão com estalactites
    for(let estalactite of estalactites) {
        if(colisao(player, estalactite)) {
            perderVida();
        }
    }

    // Verifica colisão com estalagmites
    for(let estalagmita of estalagmites) {
        if(colisao(player, estalagmita)) {
            perderVida();
        }
    }

    desenhar();
    requestAnimationFrame(atualizar);
}

// Função que perde uma vida e verifica game over
function perderVida() {
    if(gameOver) return;
    player.vidas--;
    atualizarVidas();
    if(player.vidas <= 0) {
        gameOver = true;
        document.getElementById('msg').textContent = 'GAME OVER! O Tinomauro perdeu todas as vidas!';
    }
}

// Função para desenhar tudo no canvas
function desenhar() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha o chão
    ctx.fillStyle = '#553322';
    ctx.fillRect(0, 370, canvas.width, 30);

    // Desenha as estalactites
    for(let estalactite of estalactites) {
        ctx.drawImage(estalactiteImg, estalactite.x, estalactite.y, estalactite.width, estalactite.height);
    }

    // Desenha as estalagmites
    for(let estalagmite of estalagmites) {
        ctx.drawImage(estalagmitaImg, estalagmite.x, estalagmite.y, estalagmite.width, estalagmite.height);
    }

    // Desenha o personagem
    ctx.drawImage(tinomauroImg, player.x, player.y, player.width, player.height);
}

// Evento de pulo (toque e clique)
function pular() {
    if(player.noChao && !gameOver) {
        player.vy = PULO;
    }
}

// Ouve cliques e toques na tela para pular
window.addEventListener('keydown', (e) => {
    if(e.code === 'Space') pular();
});
window.addEventListener('touchstart', pular);
window.addEventListener('mousedown', pular);

// Começa o jogo após carregar as imagens
function iniciarJogo() {
    atualizarVidas();
    atualizar();
}

window.onload = iniciarJogo;
