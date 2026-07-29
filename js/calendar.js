// calendar.js — calendário de reservas (estilo Airbnb) + verificação de disponibilidade

const BookingState = {
  checkin: null,
  checkout: null,
  days: 0,
  priceInfo: null,
  contact: null
};

(function () {
  const msgEl = document.getElementById('calendar-msg');
  const confirmBtn = document.getElementById('confirm-btn');
  const confirmHint = document.getElementById('confirm-hint');

  let reservedRanges = [];

  fetch('data/availability.json')
    .then((r) => r.json())
    .then((data) => {
      reservedRanges = (data.reservado || []).map((r) => ({
        from: r.inicio,
        to: r.fim
      }));
      if (data.precos) Pricing.setTable(data.precos);
      BookingState.contact = data.contacto || null;
      initCalendar();
      renderFooterContact(data.contacto);
    })
    .catch(() => {
      // Sem ficheiro de disponibilidade — segue com calendário livre e preços por defeito.
      initCalendar();
    });

  function initCalendar() {
    if (!window.flatpickr) return;

    flatpickr('#calendar', {
      mode: 'range',
      inline: true,
      minDate: 'today',
      dateFormat: 'Y-m-d',
      disable: reservedRanges,
      locale: {
        weekdays: {
          shorthand: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
          longhand: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
        },
        months: {
          shorthand: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
          longhand: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        },
        rangeSeparator: ' até '
      },
      onChange: handleDateChange
    });
  }

  function overlapsReserved(checkin, checkout) {
    return reservedRanges.some((r) => {
      const rFrom = new Date(r.from);
      const rTo = new Date(r.to);
      return checkin < rTo && checkout > rFrom;
    });
  }

  function handleDateChange(selectedDates) {
    if (selectedDates.length < 2) return;

    const [checkin, checkout] = selectedDates;
    const msDay = 1000 * 60 * 60 * 24;
    const days = Math.round((checkout - checkin) / msDay);

    if (days < 1) {
      showMsg('Selecione uma saída posterior à entrada.');
      resetSummary();
      return;
    }

    if (overlapsReserved(checkin, checkout)) {
      showMsg('Estas datas já se encontram reservadas.');
      resetSummary();
      return;
    }

    hideMsg();

    const priceInfo = Pricing.calculate(days);
    BookingState.checkin = checkin;
    BookingState.checkout = checkout;
    BookingState.days = days;
    BookingState.priceInfo = priceInfo;

    updateSummary(checkin, checkout, priceInfo);
    document.dispatchEvent(new CustomEvent('booking:updated'));
  }

  function showMsg(text) {
    msgEl.textContent = text;
    msgEl.removeAttribute('hidden');
  }
  function hideMsg() {
    msgEl.setAttribute('hidden', '');
  }

  function fmtDate(d) {
    return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long' });
  }

  function updateSummary(checkin, checkout, priceInfo) {
    document.getElementById('sum-checkin').textContent = fmtDate(checkin);
    document.getElementById('sum-checkout').textContent = fmtDate(checkout);
    document.getElementById('sum-days').textContent = priceInfo.days + (priceInfo.days === 1 ? ' dia' : ' dias');
    document.getElementById('sum-price-day').textContent = Pricing.formatKz(priceInfo.pricePerDay);
    document.getElementById('sum-normal').textContent = Pricing.formatKz(priceInfo.normalPrice);
    document.getElementById('sum-savings').textContent = Pricing.formatKz(priceInfo.savings);
    document.getElementById('sum-total').textContent = Pricing.formatKz(priceInfo.subtotal);

    const badge = document.getElementById('sum-badge');
    if (priceInfo.isMaxDiscount) badge.removeAttribute('hidden');
    else badge.setAttribute('hidden', '');

    confirmBtn.disabled = false;
    confirmHint.textContent = 'Reveja os seus dados e confirme a reserva.';
  }

  function resetSummary() {
    ['sum-checkin', 'sum-checkout', 'sum-days', 'sum-price-day', 'sum-normal', 'sum-savings', 'sum-total']
      .forEach((id) => (document.getElementById(id).textContent = '—'));
    document.getElementById('sum-badge').setAttribute('hidden', '');
    confirmBtn.disabled = true;
    confirmHint.textContent = 'Selecione as datas em "Disponibilidade" para continuar.';
    BookingState.checkin = null;
    BookingState.checkout = null;
    BookingState.priceInfo = null;
  }

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
