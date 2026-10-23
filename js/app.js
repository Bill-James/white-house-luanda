// app.js — orquestração geral (nav, cartões de comodidades, reveals)

const AMENITIES = [
  { icon: '🔒', label: 'Privacidade Total' },
  { icon: '✨', label: 'Limpeza Real entre Estadias' },
  { icon: '📶', label: 'Internet' },
  { icon: '❄️', label: 'Climatização' },
  { icon: '📺', label: 'Serviço de TV' },
  { icon: '🚿', label: 'Água Quente' },
  { icon: '🍳', label: 'Cozinha Equipada' },
  { icon: '🌯', label: 'Comida e Bebida com Música' }
];

(function () {
  // ---- Cartões de comodidades ----
  const grid = document.getElementById('info-grid');
  if (grid) {
    AMENITIES.forEach((a, i) => {
      const card = document.createElement('div');
      card.className = 'info-card reveal';
      card.style.transitionDelay = (i % 4) * 0.06 + 's';
      card.innerHTML = `<div class="info-icon">${a.icon}</div><h5>${a.label}</h5>`;
      grid.appendChild(card);
    });
  }

  // ---- Marca secções para reveal on-scroll ----
  document.querySelectorAll('#site section, #site .section-head').forEach((el) => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
  });

  // ---- Navbar com glassmorphism ao fazer scroll ----
  const navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- Reobserva novos elementos .reveal criados dinamicamente ----
  document.addEventListener('site:revealed', () => {
    onScroll();
    const items = document.querySelectorAll('.reveal:not(.in-view)');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('in-view');
      });
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  });
})();
