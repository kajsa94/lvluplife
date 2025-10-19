const startBtn = document.getElementById('startBtn');
const overlay = document.getElementById('whiteOverlay');

startBtn.addEventListener('click', () => {
    // Visa overlay
    overlay.style.opacity = 1;

    // Vänta lite (500ms) innan vi går till start.html
    setTimeout(() => {
        window.location.href = 'start.html';
    }, 500); // matchar CSS transition
});
