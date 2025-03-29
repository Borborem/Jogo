// script.js
const game = document.querySelector('#game');
const paddle1 = document.querySelector('#paddle1');
const paddle2 = document.querySelector('#paddle2');
const ball = document.querySelector('#ball');

let ballSpeedX = 2;
let ballSpeedY = 2;

let paddle1Y = game.clientHeight / 2 - paddle1.offsetHeight / 2; // Centralizar paddle1
let paddle2Y = game.clientHeight / 2 - paddle2.offsetHeight / 2; // Centralizar paddle2
let ballX = game.clientWidth / 2 - ball.offsetWidth / 2; // Centralizar bola
let ballY = game.clientHeight / 2 - ball.offsetHeight / 2;

const paddleSpeed = 10;

function resetBall() {
    ballX = game.clientWidth / 2 - ball.offsetWidth / 2;
    ballY = game.clientHeight / 2 - ball.offsetHeight / 2;
    ballSpeedX *= -1; // Inverter direção
}

function gameLoop() {
    // Movimentar a bola
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Checar colisões com bordas horizontais
    if (ballY <= 0 || ballY >= game.clientHeight - ball.offsetHeight) {
        ballSpeedY *= -1;
    }

    // Checar colisões com paddle1
    if (
        ballX <= paddle1.offsetWidth &&
        ballY + ball.offsetHeight >= paddle1Y &&
        ballY <= paddle1Y + paddle1.offsetHeight
    ) {
        ballSpeedX *= -1;
    }

    // Checar colisões com paddle2
    if (
        ballX + ball.offsetWidth >= game.clientWidth - paddle2.offsetWidth &&
        ballY + ball.offsetHeight >= paddle2Y &&
        ballY <= paddle2Y + paddle2.offsetHeight
    ) {
        ballSpeedX *= -1;
    }

    // Checar pontuação
    if (ballX <= 0 || ballX >= game.clientWidth - ball.offsetWidth) {
        resetBall();
    }

    // Atualizar posição da bola
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';

    // Atualizar posição dos paddles
    paddle1.style.top = paddle1Y + 'px';
    paddle2.style.top = paddle2Y + 'px';

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w': // Move o paddle1 para cima
            if (paddle1Y > 0) paddle1Y -= paddleSpeed;
            break;
        case 's': // Move o paddle1 para baixo
            if (paddle1Y < game.clientHeight - paddle1.offsetHeight) paddle1Y += paddleSpeed;
            break;
        case 'ArrowUp': // Move o paddle2 para cima
            if (paddle2Y > 0) paddle2Y -= paddleSpeed;
            break;
        case 'ArrowDown': // Move o paddle2 para baixo
            if (paddle2Y < game.clientHeight - paddle2.offsetHeight) paddle2Y += paddleSpeed;
            break;
    }
});

// Inicializar a animação
gameLoop();
