(function () {
  const confirmBtn = document.getElementById('confirm-btn');
  if (!confirmBtn) return;

  const qty = {};
  const counters = {};
  let menu = [];
  let totalEl = null;

  const el = (tag, cls, text) => Object.assign(document.createElement(tag), { className: cls, textContent: text || '' });

  function emit() {
    const items = menu.filter((m) => qty[m.id]);
    BookingState.foodInfo = items.length
      ? {
          total: items.reduce((s, m) => s + m.valor * qty[m.id], 0),
          lines: items.map((m) => `${qty[m.id]}x ${m.nome} · ${Pricing.formatKz(m.valor * qty[m.id])}`)
        }
      : null;
    if (totalEl) totalEl.textContent = BookingState.foodInfo ? `Total da comida: ${Pricing.formatKz(BookingState.foodInfo.total)}` : '';
    document.dispatchEvent(new CustomEvent('food:changed'));
  }

  function change(m, d) {
    qty[m.id] = Math.max(0, Math.min(20, (qty[m.id] || 0) + d));
    counters[m.id].textContent = qty[m.id];
    emit();
  }

  function row(m) {
    const info = el('div', 'food-info');
    info.append(el('strong', '', m.nome));
    if (m.desc) info.append(el('small', '', m.desc));

    const minus = el('button', '', '−');
    const plus = el('button', '', '+');
    minus.type = plus.type = 'button';
    minus.setAttribute('aria-label', `Menos ${m.nome}`);
    plus.setAttribute('aria-label', `Mais ${m.nome}`);
    minus.onclick = () => change(m, -1);
    plus.onclick = () => change(m, 1);

    counters[m.id] = el('output', '', '0');
    const stepper = el('div', 'food-qty');
    stepper.append(minus, counters[m.id], plus);

    const r = el('div', 'food-row');
    r.append(info, el('span', 'food-price', Pricing.formatKz(m.valor)), stepper);
    return r;
  }

  document.addEventListener('data:ready', (e) => {
    menu = (e.detail && e.detail.comida) || [];
    if (!menu.length) return;

    const box = el('div', 'field field-full food');
    box.append(
      el('span', 'food-title', 'Peça a comida (opcional)'),
      el('p', 'food-note', 'Fica registada com a sua reserva, para estar no apartamento. Bebida e música incluídas no pacote: diga a bebida nas observações.')
    );
    [...new Set(menu.map((m) => m.grupo))].forEach((g) => {
      box.append(el('h4', 'food-group', g));
      menu.filter((m) => m.grupo === g).forEach((m) => box.append(row(m)));
    });
    totalEl = el('p', 'food-total');
    box.append(totalEl);
    confirmBtn.before(box);
  });

  document.addEventListener('booking:reset', () => {
    menu.forEach((m) => {
      qty[m.id] = 0;
      if (counters[m.id]) counters[m.id].textContent = 0;
    });
    emit();
  });
})();
