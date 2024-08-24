document.addEventListener('DOMContentLoaded', () => {
    /*** DOM Elements ***/
    const gameContainer = document.getElementById('game-container');
    const runner = document.getElementById('runner');
    const obstacleContainer = document.getElementById('obstacle-container');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const pauseButton = document.getElementById('pause-button');
    const musicToggle = document.getElementById('music-toggle');
    const backToMenuButton = document.getElementById('back-to-menu');
    const backgroundMusic = document.getElementById('background-music');
    const popupContainer = document.getElementById('popup-container');
    const closePopupButton = document.getElementById('close-popup');

    /*** Sound Effects ***/
    const jumpSound = new Audio('jump-15984.mp3');
    const failSound = new Audio('mixkit-wrong-answer-fail-notification-946.wav');

    /*** Game Variables ***/
    let score = 0;
    let highScore = 0;
    let isJumping = false;
    let isGameOver = false;
    let isPaused = false;
    let obstacleSpeed = 5;
    let obstacleFrequency = 1500; // milliseconds
    let obstacleTimer;
    let scoreTimer;

    /*** Initialization ***/
    function init() {
        score = 0;
        isJumping = false;
        isGameOver = false;
        isPaused = false;
        obstacleSpeed = 5;
        obstacleContainer.innerHTML = '';
        scoreDisplay.textContent = `Score: ${score}`;
        highScoreDisplay.textContent = `High Score: ${highScore}`;
        backgroundMusic.currentTime = 0;
        backgroundMusic.volume = 0.5;
        backgroundMusic.play();
        startGame();
    }

    /*** Start Game ***/
    function startGame() {
        obstacleTimer = setInterval(createObstacle, obstacleFrequency);
        scoreTimer = setInterval(updateScore, 100);
        requestAnimationFrame(gameLoop);
    }

    /*** Game Loop ***/
    function gameLoop() {
        if (!isPaused && !isGameOver) {
            moveObstacles();
            checkCollision();
            updateBackground();
        }
        requestAnimationFrame(gameLoop);
    }

    /*** Create Obstacle ***/
    function createObstacle() {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.height = `${randomNumber(30, 80)}px`;
        obstacle.style.width = `${randomNumber(20, 50)}px`;
        obstacle.style.left = `${gameContainer.offsetWidth}px`;
        obstacleContainer.appendChild(obstacle);
    }

    /*** Move Obstacles ***/
    function moveObstacles() {
        const obstacles = document.querySelectorAll('.obstacle');
        obstacles.forEach(obstacle => {
            let obstacleLeft = obstacle.offsetLeft;
            obstacle.style.left = `${obstacleLeft - obstacleSpeed}px`;

            // Remove obstacles that are off-screen
            if (obstacleLeft + obstacle.offsetWidth <= 0) {
                obstacle.remove();
            }
        });
    }

    /*** Jump Function ***/
    function jump() {
        if (isJumping || isPaused || isGameOver) return;
        isJumping = true;
        let jumpHeight = 300; // Increased jump height (pixels)
        let jumpSpeed = 20; // pixels per frame
        let runnerBottom = parseInt(window.getComputedStyle(runner).bottom);

        jumpSound.play();

        // Jump Up
        let upInterval = setInterval(() => {
            if (runnerBottom >= jumpHeight) {
                clearInterval(upInterval);

                // Fall Down
                let downInterval = setInterval(() => {
                    if (runnerBottom <= 50) { // Adjust to match the bottom positioning in CSS
                        clearInterval(downInterval);
                        isJumping = false;
                        runner.style.bottom = '50px';
                    } else {
                        runnerBottom -= jumpSpeed;
                        runner.style.bottom = `${runnerBottom}px`;
                    }
                }, 20);
            } else {
                runnerBottom += jumpSpeed;
                runner.style.bottom = `${runnerBottom}px`;
            }
        }, 20);
    }

    /*** Collision Detection ***/
    function checkCollision() {
        const obstacles = document.querySelectorAll('.obstacle');
        obstacles.forEach(obstacle => {
            const obstacleRect = obstacle.getBoundingClientRect();
            const runnerRect = runner.getBoundingClientRect();

            if (
                runnerRect.left < obstacleRect.left + obstacleRect.width &&
                runnerRect.left + runnerRect.width > obstacleRect.left &&
                runnerRect.top < obstacleRect.top + obstacleRect.height &&
                runnerRect.height + runnerRect.top > obstacleRect.top
            ) {
                gameOver();
            }
        });
    }

    /*** Update Score ***/
    function updateScore() {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        increaseDifficulty();
    }

    /*** Increase Difficulty Over Time ***/
    function increaseDifficulty() {
        if (score % 100 === 0 && obstacleSpeed < 15) {
            obstacleSpeed += 1;
            if (obstacleFrequency > 800) {
                obstacleFrequency -= 100;
                clearInterval(obstacleTimer);
                obstacleTimer = setInterval(createObstacle, obstacleFrequency);
            }
        }
    }

    /*** Update Background Based on Score ***/
    function updateBackground() {
        if (score >= 500) {
            gameContainer.style.backgroundColor = '#1a1a1a';
        } else if (score >= 300) {
            gameContainer.style.backgroundColor = '#333';
        } else if (score >= 100) {
            gameContainer.style.backgroundColor = '#666';
        } else {
            gameContainer.style.backgroundColor = '#999';
        }
    }

    /*** Game Over ***/
    function gameOver() {
        isGameOver = true;
        failSound.play();
        backgroundMusic.pause();
        clearInterval(obstacleTimer);
        clearInterval(scoreTimer);

        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = `High Score: ${highScore}`;
        }

        showPopup(`Game Over! Your score: ${score}`);
    }

    /*** Show Popup ***/
    function showPopup(message) {
        const popupMessage = document.getElementById('popup-message');
        popupMessage.textContent = message;
        popupContainer.style.display = 'block';
    }

    /*** Close Popup ***/
    function closePopup() {
        popupContainer.style.display = 'none';
        init(); // Restart the game
    }

    /*** Show Restart Button ***/
    function showRestartButton() {
        const restartButton = document.createElement('button');
        restartButton.id = 'restart-button';
        restartButton.textContent = 'Restart Game';
        gameContainer.appendChild(restartButton);

        restartButton.addEventListener('click', () => {
            restartButton.remove();
            init();
        });
    }

    /*** Pause and Resume Game ***/
    function togglePause() {
        if (isGameOver) return;
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
        if (isPaused) {
            backgroundMusic.pause();
            clearInterval(scoreTimer);
        } else {
            backgroundMusic.play();
            scoreTimer = setInterval(updateScore, 100);
        }
    }

    /*** Toggle Music ***/
    function toggleMusic() {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicToggle.textContent = 'Mute Music';
        } else {
            backgroundMusic.pause();
            musicToggle.textContent = 'Play Music';
        }
    }

    /*** Utility Functions ***/
    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /*** Event Listeners ***/
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            jump();
        }
        if (e.code === 'KeyP') {
            togglePause();
        }
    });

    runner.addEventListener('click', jump);

    pauseButton.addEventListener('click', togglePause);
    musicToggle.addEventListener('click', toggleMusic);
    backToMenuButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    closePopupButton.addEventListener('click', closePopup);

    /*** Start the Game ***/
    init();
});
