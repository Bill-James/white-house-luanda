// gallery.js — grelha de imagens + lightbox em ecrã inteiro

const GALLERY_ITEMS = [
  {
    img: 'assets/imagens/sala.jpg',
    title: 'Sala',
    tags: ['Sofá', 'Mesa de Jantar', 'TV', 'Ar Condicionado']
  },
  {
    img: 'assets/imagens/sala-jantar.jpg',
    title: 'Zona de Estar',
    tags: ['Espaço de Refeições', 'TV', 'Ambiente Reservado']
  },
  {
    img: 'assets/imagens/quarto.jpg',
    title: 'Quarto',
    tags: ['Cama de Casal', 'Roupa de Cama Incluída', 'Toalhas Incluídas', 'Cortinado']
  },
  {
    img: 'assets/imagens/cozinha-bancada.jpg',
    title: 'Cozinha',
    tags: ['Kitchenette Equipada', 'Torradeira', 'Jarro Elétrico', 'Louça Incluída']
  },
  {
    img: 'assets/imagens/cozinha-eletros.jpg',
    title: 'Cozinha — Eletrodomésticos',
    tags: ['Frigorífico', 'Micro-ondas', 'Sem Fogão']
  },
  {
    img: 'assets/imagens/vista-janela.jpg',
    title: 'Localização',
    tags: ['Zona Central de Luanda', 'Fácil Acesso']
  },
  {
    img: 'assets/imagens/centro-cidade.jpg',
    title: 'Centro da Cidade',
    tags: ['A poucos minutos', 'Banco de Desenvolvimento de Angola', 'Fácil Acesso']
  },
  {
    img: 'assets/imagens/hero-marginal-luanda.jpg',
    title: 'Marginal de Luanda',
    tags: ['Passeio à Beira-Mar', 'A curta distância']
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
