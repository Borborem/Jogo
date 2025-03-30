// script.js
const game = document.querySelector('#game');
const paddle1 = document.querySelector('#paddle1');
const paddle2 = document.querySelector('#paddle2');
const ball = document.querySelector('#ball');
const score1Display = document.querySelector('#score1');
const score2Display = document.querySelector('#score2');

let score1 = 0; // Pontuação do Jogador 1
let score2 = 0; // Pontuação do Jogador 2

function announceScore() {
  const message = `${score1} a ${score2}`;
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "pt-BR"; // Configurar para português do Brasil
  window.speechSynthesis.speak(utterance);
}

let ballSpeedX = 3;
let ballSpeedY = 2;

let paddle1Y = game.clientHeight / 2 - paddle1.offsetHeight / 2; // Centralizar paddle1
let paddle2Y = game.clientHeight / 2 - paddle2.offsetHeight / 2; // Centralizar paddle2
let ballX = game.clientWidth / 2 - ball.offsetWidth / 2; // Centralizar bola
let ballY = game.clientHeight / 2 - ball.offsetHeight / 2;

const paddleSpeed = 6;

// Estado das teclas
const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

function resetBall() {
    ballX = game.clientWidth / 2 - ball.offsetWidth / 2;
    ballY = game.clientHeight / 2 - ball.offsetHeight / 2;
    ballSpeedX *= -1; // Inverter direção
 //   announceScore();
    // Atualizar os displays de pontuação
    score1Display.textContent = score1;
    score2Display.textContent = score2;
}

// if (ballX <= 0) {
//     score2++; // Jogador 2 marca ponto
//     resetBall();
// } else if (ballX >= game.clientWidth - ball.offsetWidth) {
//     score1++; // Jogador 1 marca ponto
//     resetBall();
// }


function playBeep() {
    const beepSound = document.querySelector('#beep-sound');
    if (beepSound) {
        beepSound.currentTime = 0; // Reinicia o áudio
        beepSound.play(); // Toca o som
    }
}
function gameLoop() {
    // Movimentar a bola
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Checar colisões com bordas horizontais
    if (ballY <= 0 || ballY >= game.clientHeight - ball.offsetHeight) {
        playBeep();
        ballSpeedY *= -1; 
    }

    // Checar colisões com paddle1
    if (
        ballX <= paddle1.offsetWidth +10 &&
        ballY + ball.offsetHeight >= paddle1Y &&
        ballY <= paddle1Y + paddle1.offsetHeight
    ) {
        playBeep();
        ballSpeedX *= -1;
        
    }

    // Checar colisões com paddle2
    if (
        ballX + ball.offsetWidth >= game.clientWidth - paddle2.offsetWidth +10 &&
        ballY + ball.offsetHeight >= paddle2Y &&
        ballY <= paddle2Y + paddle2.offsetHeight
    ) {
        playBeep();
        ballSpeedX *= -1;   
    }

    // Checar pontuação
    if (ballX < -20) {
        score2++;
        resetBall();
    }else if (ballX >= game.clientWidth + 20) {
        score1++;
        resetBall();
    }

    // Movimentar paddles
    if (keys.w && paddle1Y > 0) {
        paddle1Y -= paddleSpeed;
    }
    if (keys.s && paddle1Y < game.clientHeight - paddle1.offsetHeight) {
        paddle1Y += paddleSpeed;
    }
    if (keys.ArrowUp && paddle2Y > 0) {
        paddle2Y -= paddleSpeed;
    }
    if (keys.ArrowDown && paddle2Y < game.clientHeight - paddle2.offsetHeight) {
        paddle2Y += paddleSpeed;
    }

    // Atualizar posição da bola
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';

    // Atualizar posição dos paddles
    paddle1.style.top = paddle1Y + 'px';
    paddle2.style.top = paddle2Y + 'px';

    requestAnimationFrame(gameLoop);
}

// Adicionar evento de teclado para rastrear teclas pressionadas
document.addEventListener('keydown', (event) => {
    if (event.key in keys) {
        keys[event.key] = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key in keys) {
        keys[event.key] = false;
    }
});

// Inicializar a animação
gameLoop();
