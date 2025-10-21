// ========== LVLUPLIFE – SINGLE PAGE FLOW ==========
// Frontpage → Onboarding → SobrietyPage

document.addEventListener('DOMContentLoaded', () => {
  // ---- Login modal ----
  const openBtn  = document.getElementById('openLogin');
  const modal    = document.getElementById('loginModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const backdrop = document.getElementById('modalBackdrop');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
    });
  }

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  };
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // ---- Sektioner ----
  const frontpage   = document.getElementById('frontpage');
  const startBtn    = document.getElementById('startBtn');
  const onboarding  = document.getElementById('onboarding');
  const form        = document.getElementById('onboardingForm');
  const sobrietyPage = document.getElementById('sobrietyPage');

  // Grund: visa bara frontpage
  if (onboarding) onboarding.style.display = 'none';
  if (sobrietyPage) sobrietyPage.style.display = 'none';

  // ===== START YOUR JOURNEY =====
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      // Visa onboarding, göm frontpage
      if (frontpage) frontpage.style.display = 'none';
      if (onboarding) onboarding.style.display = 'block';

      // Uppdatera historik så back fungerar
      history.pushState({ page: 'onboarding' }, '', '#onboarding');
    });
  }

  // ===== Onboarding submit =====
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const selected = [...document.querySelectorAll('input[name="areas"]:checked')]
        .map(cb => cb.value);

      const areas = selected.length ? selected : ['Self-care'];
      localStorage.setItem('lvluplife_areas', JSON.stringify(areas));

      // Visa rätt sida baserat på val
      if (areas.includes('Sobriety')) {
        if (onboarding) onboarding.style.display = 'none';
        if (sobrietyPage) sobrietyPage.style.display = 'block';
        history.pushState({ page: 'sobrietyPage' }, '', '#sobriety');
      }
    });
  }

  // ===== Browserns back-knapp =====
  window.addEventListener('popstate', (event) => {
    const currentPage = event.state?.page || 'frontpage';

    // Dölj alla
    [frontpage, onboarding, sobrietyPage].forEach(el => {
      if (el) el.style.display = 'none';
    });

    if (currentPage === 'onboarding') {
      onboarding.style.display = 'block';
    } else if (currentPage === 'sobrietyPage') {
      sobrietyPage.style.display = 'block';
    } else {
      frontpage.style.display = 'flex';
    }
  });
});
