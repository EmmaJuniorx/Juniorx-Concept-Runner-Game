// UI.js

const startButton = document.getElementById('start-button');
const creditsButton = document.getElementById('credits-button');
const musicToggle = document.getElementById('music-toggle');
const volumeControl = document.getElementById('volume-control');
const backToMenu = document.getElementById('back-to-menu');
const backgroundMusic = document.getElementById('background-music');

backgroundMusic.volume = 0.5; // Set initial volume
backgroundMusic.play(); // Start the music

startButton.addEventListener('click', () => {
    window.location.href = 'game.html';
});

creditsButton.addEventListener('click', () => {
    document.getElementById('menu-screen').style.display = 'none';
    document.getElementById('credits-screen').style.display = 'block';
});

backToMenu.addEventListener('click', () => {
    document.getElementById('credits-screen').style.display = 'none';
    document.getElementById('menu-screen').style.display = 'block';
});

musicToggle.addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        musicToggle.textContent = 'Pause Music';
    } else {
        backgroundMusic.pause();
        musicToggle.textContent = 'Play Music';
    }
});

volumeControl.addEventListener('input', (event) => {
    const volume = event.target.value / 100;
    backgroundMusic.volume = volume;
});
