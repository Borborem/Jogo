// script.js
const game = document.querySelector('#game');
const paddle1 = document.querySelector('#paddle1');
const paddle2 = document.querySelector('#paddle2');
const ball = document.querySelector('#ball');

let ballSpeedX = 2;
let ballSpeedY = 2;

// Variáveis para a posição inicial dos paddles
let paddle1Y = paddle1.offsetTop;
let paddle2Y = paddle2.offsetTop;

// Velocidade de movimento dos paddles
const paddleSpeed = 5;

function gameLoop() {
    // Movimentar a bola
    let ballX = ball.offsetLeft + ballSpeedX;
    let ballY = ball.offsetTop + ballSpeedY;
    

    // Checar colisões com bordas
    if (ballX <= 0 || ballX >= game.clientWidth - ball.offsetWidth) {
        ballSpeedX *= -1;
    }

    if (ballY <= 0 || ballY >= game.clientHeight - ball.offsetHeight) {
        ballSpeedY *= -1;
    }

    // Atualizar posição da bola
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';

    // Atualizar posição dos paddles
    paddle1.style.top = paddle1Y + 'px';
    paddle2.style.top = paddle2Y + 'px';

    requestAnimationFrame(gameLoop);
}

// Adicionar evento de teclado para controlar os paddles
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

// Iniciar a animação
gameLoop();
