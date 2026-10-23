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
  },
  {
    img: 'assets/imagens/menu-fahitas.jpg',
    alt: 'Cardápio de fahitas e batatas do Pepê',
    fit: 'contain',
    title: 'Comida e Bebida',
    tags: ['Fahitas', 'Batatas do Pepê', 'Bebida e Música incluídas'],
    slides: [
      { img: 'assets/imagens/menu-fahitas.jpg', title: 'Cardápio · Fahitas' },
      { img: 'assets/imagens/menu-batatas.jpg', title: 'Cardápio · Batatas do Pepê' }
    ]
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
      <img src="${item.img}" alt="${item.alt || item.title + ' do apartamento'}" loading="lazy"${item.fit ? ` style="object-fit:${item.fit};background:#0b0f14"` : ''}>
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
  const prev = document.getElementById('lightbox-prev');
  const next = document.getElementById('lightbox-next');

  let slides = [];
  let tags = [];
  let idx = 0;

  function render() {
    const s = slides[idx];
    const multi = slides.length > 1;
    lightboxImg.src = s.img;
    lightboxImg.alt = s.title;
    lightboxImg.style.cursor = multi ? 'pointer' : '';
    lightboxCaption.textContent = `${s.title} — ${tags.join(' · ')}${multi ? ` (${idx + 1}/${slides.length}) · toque na imagem para ver a seguinte` : ''}`;
    prev.classList.toggle('on', multi);
    next.classList.toggle('on', multi);
  }

  function step(d) {
    idx = (idx + d + slides.length) % slides.length;
    render();
  }

  function openLightbox(item) {
    slides = item.slides || [{ img: item.img, title: item.title }];
    tags = item.tags;
    idx = 0;
    render();
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
  lightboxImg.addEventListener('click', () => slides.length > 1 && step(1));
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    else if (!lightbox.hasAttribute('hidden') && slides.length > 1 && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) step(e.key === 'ArrowRight' ? 1 : -1);
  });
})();
