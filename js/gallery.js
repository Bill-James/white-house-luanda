// gallery.js — grelha de imagens + lightbox em ecrã inteiro

const GALLERY_ITEMS = [
  {
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
    title: 'Sala',
    tags: ['45 m²', 'Smart TV', 'Internet Fibra', 'Vista Mar']
  },
  {
    img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
    title: 'Quarto',
    tags: ['Cama Queen Size', 'Ar Condicionado', 'Varanda', 'Iluminação Inteligente']
  },
  {
    img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop',
    title: 'Cozinha',
    tags: ['Equipada', 'Ilha Central', 'Eletrodomésticos Novos']
  },
  {
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    title: 'Casa de Banho',
    tags: ['Duche a Vapor', 'Água Quente', 'Acabamento Premium']
  },
  {
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
    title: 'Varanda',
    tags: ['Vista Mar', 'Mobiliário Exterior', 'Pôr do Sol']
  },
  {
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop',
    title: 'Entrada',
    tags: ['Segurança 24h', 'Receção Privada']
  }
];

(function () {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  GALLERY_ITEMS.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'gallery-item reveal';
    el.style.transitionDelay = (i % 3) * 0.08 + 's';
    el.innerHTML = `
      <img src="${item.img}" alt="${item.title} do apartamento" loading="lazy">
      <div class="gallery-caption">
        <h4>${item.title}</h4>
        <ul>${item.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
      </div>
    `;
    el.addEventListener('click', () => openLightbox(item));
    grid.appendChild(el);
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  function openLightbox(item) {
    lightboxImg.src = item.img;
    lightboxImg.alt = item.title;
    lightboxCaption.textContent = `${item.title} — ${item.tags.join(' · ')}`;
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
})();
