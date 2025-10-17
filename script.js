const PORTAL_DURATION_MS = 900;

document.addEventListener('DOMContentLoaded', () => {
  const portal = document.querySelector('#portal');
  const startBtn = document.querySelector('#startBtn');

  const resetPortal = () => {
    if (portal) portal.classList.remove('portal--open');
    sessionStorage.removeItem('lvluplife_justNavigated');
  };

  window.addEventListener('pageshow', resetPortal);
  resetPortal();

  if (startBtn && portal) {
    startBtn.addEventListener('click', () => {
      sessionStorage.setItem('lvluplife_justNavigated', '1');
      portal.classList.add('portal--open');
      setTimeout(() => {
        window.location.href = 'next.html';
      }, PORTAL_DURATION_MS);
    });
  }
});
