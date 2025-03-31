// script.js
const game = document.querySelector('#game');
const paddle1 = document.querySelector('#paddle1');
const paddle2 = document.querySelector('#paddle2');
const ball = document.querySelector('#ball');
const score1Display = document.querySelector('#score1');
const score2Display = document.querySelector('#score2');

let score1 = 0; // Pontuação do Jogador 1
let score2 = 0; // Pontuação do Jogador 2

let curveFactor = 30; // Intensidade da curva

function beep() {
    // Criar o contexto de áudio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
    // Criar um oscilador
    const oscilador = audioContext.createOscillator();
    oscilador.type = 'square'; // Tipo de som (pode ser 'sine', 'square', 'sawtooth', 'triangle')
    oscilador.frequency.setValueAtTime(440, audioContext.currentTime); // Frequência do "beep" em Hz
  
    // Conectar ao destino (alto-falantes)
    oscilador.connect(audioContext.destination);
  
    // Iniciar e parar o som rapidamente
    oscilador.start();
    setTimeout(() => oscilador.stop(), 100); // Duração do beep: 100ms
}

function announceScore() {
  const message = `${score1} a ${score2}`;
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "pt-BR"; // Configurar para português do Brasil
  window.speechSynthesis.speak(utterance);
}

let ballSpeedX = 4;
let ballSpeedY = 2;

let paddle1Y = game.clientHeight / 2 - paddle1.offsetHeight / 2; // Centralizar paddle1
let paddle2Y = game.clientHeight / 2 - paddle2.offsetHeight / 2; // Centralizar paddle2
let ballX = game.clientWidth / 2 - ball.offsetWidth / 2; // Centralizar bola
let ballY = game.clientHeight / 2 - ball.offsetHeight / 2;

const paddleSpeed = 6;

function adjustBallSpeed() {
    const speedIncreaseFactor = 1.2; // Fator de aumento de velocidade.

    // Incrementar a velocidade com base na direção atual
    ballSpeedX += ballSpeedX > 0 ? speedIncreaseFactor : -speedIncreaseFactor;

    // Limite de velocidade máxima para evitar valores exagerados
    const maxSpeed = 18;
    ballSpeedX = Math.min(Math.max(ballSpeedX, -maxSpeed), maxSpeed);
}

// Estado das teclas
const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

let lastScorer = null; // Variável para rastrear quem marcou o último ponto

function resetBall() {
    if (lastScorer === 'player1') {
        // Saída próxima ao Paddle 2 (lado contrário do Jogador 1)
        ballX = game.clientWidth - paddle2.offsetWidth - ball.offsetWidth -10;
        ballY = (paddle2Y - ball.offsetHeight / 2) + 50;
        ballSpeedX = -4; // Garantir que vá em direção ao Paddle 1
    } else if (lastScorer === 'player2') {
        // Saída próxima ao Paddle 1 (lado contrário do Jogador 2)
        ballX = paddle1.offsetWidth + 30;
        ballY = (paddle1Y - ball.offsetHeight / 2) + 50;
        ballSpeedX = 4; // Garantir que vá em direção ao Paddle 2
    } else {
        // Caso inicial ou sem histórico, centralizar a bola
        ballX = game.clientWidth / 2 - ball.offsetWidth / 2;
    }    

   // announceScore(); PARA NARRAR O PLACAR

    // Atualizar displays de pontuação
    score1Display.textContent = score1;
    score2Display.textContent = score2;
}

function updateBallColor() {
    // Calcular a velocidade atual da bola (vetor resultante)
    const speed = Math.sqrt(ballSpeedX ** 2 + ballSpeedY ** 2);

    // Definir a cor com base na velocidade
    if (speed <= 8) {
        ball.style.backgroundColor = "#00FF00"; // Verde - velocidade baixa
    } else if (speed <= 12) {
        ball.style.backgroundColor = "#FFFF00"; // Amarelo - velocidade média
    }else if (speed <= 16) {
        ball.style.backgroundColor = "#ff6b6b"; // Vermelho - velocidade média
    } else {
        ball.style.backgroundColor = "#FFFFFF"; // Roxo - velocidade máxima
      //  updateBallHalo();
    }
}

function updateBallHalo() {
    const speed = Math.sqrt(ballSpeedX ** 2 + ballSpeedY ** 2);
    const intensity = Math.min(speed / 2, 10); // Limitar a intensidade do halo
    
    ball.style.boxShadow = `0 0 ${15 + intensity}px ${5 + intensity}px rgba(255, 255, 255, 0.8)`;
    ball.style.filter = `drop-shadow(0 0 ${10 + intensity}px rgba(255, 255, 255, 0.8))`;
}


function playBeep() {
    // const beepSound = document.querySelector('#beep-sound');
    // if (beepSound) {
    //     beepSound.currentTime = 0; // Reinicia o áudio
    //     beepSound.play(); // Toca o som
    // }
    beep();
}

function gameLoop() {
    // Movimentar a bola
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if (Math.sqrt(ballSpeedX ** 2 + ballSpeedY ** 2) > 16) {
        ballY += Math.sin(ballX * curveFactor)*4;
    }

    updateBallColor();

    // Checar colisões com bordas horizontais
    if (ballY <= 0 || ballY >= game.clientHeight - ball.offsetHeight) {
        playBeep();
        ballSpeedY *= -1; 
    }

    // Checar colisões com paddle1
    if (
        ballX <= paddle1.offsetWidth +10 && ballY + ball.offsetHeight >= paddle1Y && ballY <= paddle1Y + paddle1.offsetHeight
    ) {
        playBeep();
        ballSpeedX *= -1;
        adjustBallSpeed();  
    }

    // Checar colisões com paddle2
    if (
        ballX + ball.offsetWidth >= game.clientWidth - paddle2.offsetWidth +10 && ballY + ball.offsetHeight >= paddle2Y && ballY <= paddle2Y + paddle2.offsetHeight
    ) {
        playBeep();
        ballSpeedX *= -1; 
        adjustBallSpeed();  
    }

    // Checar pontuação
    if (ballX < -20) {
        score2++;
        lastScorer = 'player2';
        resetBall();
    }else if (ballX >= game.clientWidth + 20) {
        score1++;
        lastScorer = 'player1';
        resetBall();
    }

    // Movimentar paddles com proteção de limite
    if (keys.w && keys.s) {
        // Jogador 1: não faz nada se ambas as teclas (W e S) forem pressionadas
    } else if (keys.w && paddle1Y > 0) {
        paddle1Y -= paddleSpeed;
    } else if (keys.s && paddle1Y < game.clientHeight - paddle1.offsetHeight) {
        paddle1Y += paddleSpeed;
    }

    if (keys.ArrowUp && keys.ArrowDown) {
        // Jogador 2: não faz nada se ambas as teclas (ArrowUp e ArrowDown) forem pressionadas
    } else if (keys.ArrowUp && paddle2Y > 0) {
        paddle2Y -= paddleSpeed;
    } else if (keys.ArrowDown && paddle2Y < game.clientHeight - paddle2.offsetHeight) {
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
