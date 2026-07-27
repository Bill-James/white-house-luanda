// lamp.js — sequência cinematográfica de abertura ("acender a luz")

(function () {
  const switchBtn = document.getElementById('switch-btn');
  const intro = document.getElementById('intro');
  const site = document.getElementById('site');
  const body = document.body;

  if (!switchBtn) return;

  let ignited = false;

  function ignite() {
    if (ignited) return;
    ignited = true;

    body.classList.add('lit');

    // Pequeno som opcional — omitido por defeito (sem asset de áudio incluído).
    // Se quiseres som, adiciona um <audio> e chama .play() aqui.

    if (window.gsap) {
      const tl = gsap.timeline();
      tl.to('.lamp-glow', { scale: 1.8, duration: 1.2, ease: 'power2.out' }, 0)
        .to('.intro-copy', { opacity: 0, y: -16, duration: 0.6, ease: 'power1.in' }, 0.9)
        .to(intro, {
          opacity: 0,
          duration: 1.1,
          ease: 'power2.inOut',
          onComplete: revealSite
        }, 1.3);
    } else {
      setTimeout(revealSite, 1400);
    }
  }

  function revealSite() {
    intro.classList.add('hide');
    intro.setAttribute('hidden', '');
    site.removeAttribute('hidden');
    document.dispatchEvent(new CustomEvent('site:revealed'));
    initScrollReveal();
  }

  function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('in-view');
      });
    }, { threshold: 0.15 });
    items.forEach((el) => io.observe(el));
  }

  switchBtn.addEventListener('click', ignite);
  switchBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ignite(); }
  });
})();
