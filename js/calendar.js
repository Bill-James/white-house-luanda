const BookingState = { items: [], priceInfo: null, foodInfo: null, contact: null };

(function () {
  const msgEl = document.getElementById('calendar-msg');
  const slotsEl = document.getElementById('slots');
  const confirmBtn = document.getElementById('confirm-btn');
  const confirmHint = document.getElementById('confirm-hint');

  let reserved = new Set();
  let currentDate = null;

  fetch('data/availability.json')
    .then((r) => r.json())
    .then((data) => {
      reserved = new Set(data.reservado || []);
      if (data.precos) Pricing.setTable(data.precos);
      BookingState.contact = data.contacto || null;
      initCalendar();
      renderFooterContact(data.contacto);
      document.dispatchEvent(new CustomEvent('data:ready', { detail: data }));
    })
    .catch(initCalendar);

  function initCalendar() {
    if (!window.flatpickr) return;

    flatpickr('#calendar', {
      inline: true,
      minDate: 'today',
      dateFormat: 'Y-m-d',
      locale: {
        weekdays: {
          shorthand: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
          longhand: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
        },
        months: {
          shorthand: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
          longhand: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        }
      },
      onChange: (_, date) => {
        if (!date) return;
        currentDate = date;
        renderSlots();
      }
    });
  }

  const el = (tag, cls, text) => Object.assign(document.createElement(tag), { className: cls, textContent: text });
  const free = (s) => !reserved.has(`${currentDate}|${s.id}`) && Pricing.bookable(currentDate, s);
  const isOn = (id) => BookingState.items.some((x) => x.date === currentDate && x.id === id);

  function slotBtn(s) {
    const ok = free(s);
    const b = el('button', 'btn ' + (isOn(s.id) ? 'btn-primary' : 'btn-ghost'), `${s.label} · ${Pricing.formatKz(s.valor)}`);
    b.type = 'button';
    b.disabled = !ok;
    if (!ok) b.style.opacity = 0.35;
    b.onclick = () => toggle(s.id);
    return b;
  }

  function renderSlots() {
    const table = Pricing.getTable();
    msgEl.textContent = 'Sem horários livres nesta data. As reservas exigem 24h de antecedência.';
    msgEl.hidden = table.some(free);
    slotsEl.replaceChildren();
    [...new Set(table.map((s) => s.grupo))].forEach((g) => {
      const row = el('div', '', '');
      row.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px';
      table.filter((s) => s.grupo === g).forEach((s) => row.appendChild(slotBtn(s)));
      slotsEl.append(el('p', 'confirm-hint', g), row);
    });
  }

  function toggle(id) {
    const items = BookingState.items;
    const i = items.findIndex((x) => x.date === currentDate && x.id === id);
    if (i < 0) items.push({ date: currentDate, id });
    else items.splice(i, 1);
    items.sort((a, b) => a.date.localeCompare(b.date) || Pricing.find(a.id).h - Pricing.find(b.id).h);
    BookingState.priceInfo = Pricing.calculate(items);
    renderSlots();
    updateSummary();
  }

  function updateSummary() {
    const p = BookingState.priceInfo;
    const f = BookingState.foodInfo;
    const set = (id, v) => (document.getElementById(id).innerHTML = v);
    set('sum-slots', p ? p.lines.join('<br>') : '—');
    set('sum-count', p ? `${p.count} ${p.count === 1 ? 'período' : 'períodos'}` : '—');
    set('sum-food', f ? f.lines.join('<br>') : '—');
    set('sum-total', p || f ? Pricing.formatKz((p ? p.total : 0) + (f ? f.total : 0)) : '—');
    confirmBtn.disabled = !p;
    confirmHint.textContent = p
      ? 'Reveja os seus dados e confirme a reserva.'
      : 'Selecione data e horário em "Disponibilidade" para continuar.';
  }

  document.addEventListener('food:changed', updateSummary);

  document.addEventListener('booking:reset', () => {
    BookingState.items = [];
    BookingState.priceInfo = null;
    if (currentDate) renderSlots();
    updateSummary();
  });

  function renderFooterContact(contacto) {
    if (!contacto) return;
    const phone = document.getElementById('footer-phone');
    const email = document.getElementById('footer-email');
    const wa = document.getElementById('footer-whatsapp');
    const ig = document.getElementById('footer-instagram');
    if (phone) phone.textContent = contacto.telefone || '';
    if (email) email.textContent = contacto.email || '';
    if (wa && contacto.whatsapp) wa.href = `https://wa.me/${contacto.whatsapp}`;
    if (ig && contacto.instagram) ig.href = contacto.instagram;
  }
})();
