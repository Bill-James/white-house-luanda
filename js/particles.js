// particles.js — partículas ambiente leves (CSS/DOM, sem dependência 3D pesada)

(function () {
  const container = document.getElementById('intro-particles');
  if (!container) return;

  const COUNT = 46;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = Math.random() * 100 + 'vh';
    p.style.opacity = (Math.random() * 0.35 + 0.08).toFixed(2);
    container.appendChild(p);

    animateParticle(p);
  }

  function animateParticle(el) {
    const duration = Math.random() * 14000 + 10000;
    const driftX = (Math.random() - 0.5) * 80;

    el.animate([
      { transform: 'translate(0,0)' },
      { transform: `translate(${driftX}px, -120vh)` }
    ], {
      duration,
      iterations: Infinity,
      easing: 'linear',
      delay: Math.random() * -duration
    });
  }
})();
