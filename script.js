// ========== LVLUPLIFE – SINGLE PAGE FLOW ==========
// Hero → Onboarding → Dashboard (byggs av dina val)

// Kör först när DOM finns
document.addEventListener('DOMContentLoaded', () => {
  // ---- Login modal (oförändrat) ----
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
  const hero       = document.getElementById('hero');
  const startBtn   = document.getElementById('startBtn');
  const onboarding = document.getElementById('onboarding');
  const dashboard  = document.getElementById('dashboard');
  const form       = document.getElementById('onboardingForm');

  // Grund: visa bara hero
  if (onboarding) onboarding.style.display = 'none';
  if (dashboard)  dashboard.style.display  = 'none';

  // Start your journey → visa onboarding
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (hero) hero.style.display = 'none';
      if (onboarding) {
        onboarding.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // ===== Onboarding submit → bygg dashboard dynamiskt =====
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Läs alla valda områden
      const selected = [...document.querySelectorAll('input[name="areas"]:checked')]
        .map(cb => cb.value);

      // Fallback om inget valt
      const areas = selected.length ? selected : ['Self-care'];

      // Spara (om du vill nyttja senare)
      localStorage.setItem('lvluplife_areas', JSON.stringify(areas));

      // Visa dashboard
      if (onboarding) onboarding.style.display = 'none';
      if (dashboard) {
        dashboard.style.display = 'block';
        renderDashboard(areas);
        dashboard.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ====== Dashboard-rendering utifrån val ======
  function renderDashboard(areas) {
    // finns en container?
    const container = dashboard.querySelector('.dashboard-container') || dashboard;
    let grid = dashboard.querySelector('.dash-grid');

    if (!grid) {
      grid = document.createElement('div');
      grid.className = 'dash-grid';
      container.appendChild(grid);
    }
    grid.innerHTML = '';

    // Sobriety → streak-kort
    if (areas.includes('Sobriety')) {
      grid.appendChild(cardSobriety());
    }
    // Self-care → enkel checklista
    if (areas.includes('Self-care')) {
      grid.appendChild(cardChecklist('Self-care', ['AM-rutin', 'PM-rutin', 'Hygien check', 'Ta medicin']));
    }
    // Nutrition
    if (areas.includes('Nutrition')) {
      grid.appendChild(cardChecklist('Nutrition', ['Drick vatten', 'Grönsak till måltid', 'Ingen energidryck']));
    }
    // Fitness
    if (areas.includes('Fitness')) {
      grid.appendChild(cardChecklist('Fitness', ['10 min promenad', 'Stretch 5 min', '20 squats']));
    }

    // Journal alltid
    grid.appendChild(cardJournal());
  }

  // ===== Komponenter =====
  function cardSobriety() {
    const el = document.createElement('section');
    el.className = 'card card-glow';
    el.innerHTML = `
      <h2>Streak</h2>
      <div class="streak-wrap">
        <div class="streak-num" id="streakNum">0</div>
        <div class="streak-label">dagar nykter</div>
      </div>
      <button class="start-btn wide" id="checkinBtn">Jag är nykter idag</button>
      <p class="mini" id="lastCheckinNote"></p>
    `;
    const streakNum = el.querySelector('#streakNum');
    const btn = el.querySelector('#checkinBtn');
    const note = el.querySelector('#lastCheckinNote');

    const state = getJSON('lvluplife_checkins', {});
    const today = () => new Date().toISOString().slice(0,10);

    function render() {
      // räkna sammanhängande dagar
      let streak = 0;
      const d = new Date(); d.setHours(0,0,0,0);
      while (true) {
        const k = d.toISOString().slice(0,10);
        if (state[k]) { streak++; d.setDate(d.getDate()-1); }
        else break;
      }
      streakNum.textContent = streak;
      const last = Object.keys(state).sort().pop();
      note.textContent = last ? `Senast registrerat: ${last}` : 'Ingen registrering ännu.';
      const done = !!state[today()];
      btn.disabled = done;
      if (done) btn.textContent = 'Redan checkad idag ✓';
    }

    btn.addEventListener('click', () => {
      state[today()] = true;
      setJSON('lvluplife_checkins', state);
      render();
      popEmoji('✨');
    });

    render();
    return el;
  }

  function cardChecklist(area, items) {
    const el = document.createElement('section');
    el.className = 'card';
    el.innerHTML = `
      <h2>${area}</h2>
      <div class="mini" style="opacity:.85">Dagens mikrovanor</div>
      <ul class="habits">
        ${items.map(label => {
          const id = slug(`${area}-${label}`);
          const checked = getHabit(area, label) ? 'checked' : '';
          return `
            <li>
              <label class="row">
                <input type="checkbox" id="${id}" ${checked}/>
                <span>${label}</span>
              </label>
            </li>
          `;
        }).join('')}
      </ul>
    `;
    // event per checkbox
    items.forEach(label => {
      const id = slug(`${area}-${label}`);
      const cb = el.querySelector(`#${id}`);
      cb?.addEventListener('change', (e) => {
        setHabit(area, label, e.target.checked);
        popEmoji(e.target.checked ? '✔️' : '↩️');
      });
    });
    return el;
  }

  function cardJournal() {
    const el = document.createElement('section');
    el.className = 'card';
    el.innerHTML = `
      <h2>Dagens reflektion</h2>
      <p class="mini">Hur känns det idag?</p>
      <textarea class="ui-input" id="journal" rows="3" placeholder="Kort anteckning..."></textarea>
      <div class="row end" style="margin-top:10px">
        <button class="start-btn" id="saveJournal">Spara</button>
      </div>
      <p class="mini" id="savedJournalMsg" style="display:none;">Sparat ✓</p>
    `;
    const ta  = el.querySelector('#journal');
    const btn = el.querySelector('#saveJournal');
    const msg = el.querySelector('#savedJournalMsg');

    const all = getJSON('lvluplife_journal', {});
    ta.value = all[todayKey()] ?? '';

    btn.addEventListener('click', () => {
      const data = getJSON('lvluplife_journal', {});
      data[todayKey()] = ta.value.trim();
      setJSON('lvluplife_journal', data);
      msg.style.display = 'block';
      setTimeout(()=> msg.style.display = 'none', 1200);
      popEmoji('');
    });

    return el;
  }

  // ===== Helpers =====
  function getJSON(k, def){ try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } }
  function setJSON(k, v){ localStorage.setItem(k, JSON.stringify(v)); }
  function slug(s){ return s.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,''); }
  function todayKey(){ return new Date().toISOString().slice(0,10); }
  function popEmoji(e='✨'){
    const el = document.createElement('div');
    el.className = 'confetti';
    el.textContent = e;
    document.body.appendChild(el);
    setTimeout(()=> el.remove(), 900);
  }

  // Bonus: back-knapp → tillbaka till hero om dash visas
  window.addEventListener('popstate', () => {
    if (dashboard && dashboard.style.display === 'block') {
      dashboard.style.display = 'none';
      if (hero) hero.style.display = 'flex';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});
