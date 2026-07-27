// whatsapp.js — monta a mensagem de reserva e abre o WhatsApp

(function () {
  const confirmBtn = document.getElementById('confirm-btn');
  const overlay = document.getElementById('confirm-overlay');
  if (!confirmBtn) return;

  function fmtDate(d) {
    return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long' });
  }

  function buildMessage() {
    const nome = document.getElementById('f-nome').value.trim() || 'Não informado';
    const telefone = document.getElementById('f-telefone').value.trim() || 'Não informado';
    const obs = document.getElementById('f-obs').value.trim();
    const { checkin, checkout, priceInfo } = BookingState;

    let msg = `Olá. Gostaria de reservar o apartamento.\n\n`;
    msg += `Nome: ${nome}\n`;
    msg += `Telefone: ${telefone}\n`;
    msg += `Entrada: ${fmtDate(checkin)}\n`;
    msg += `Saída: ${fmtDate(checkout)}\n`;
    msg += `Número de dias: ${priceInfo.days}\n`;
    msg += `Preço por dia: ${Pricing.formatKz(priceInfo.pricePerDay)}\n`;
    msg += `Valor total: ${Pricing.formatKz(priceInfo.subtotal)}\n`;
    if (obs) msg += `Observações: ${obs}\n`;
    msg += `\nAguardo confirmação.`;

    return msg;
  }

  confirmBtn.addEventListener('click', () => {
    if (!BookingState.checkin || !BookingState.checkout || !BookingState.priceInfo) return;

    const nome = document.getElementById('f-nome').value.trim();
    const telefone = document.getElementById('f-telefone').value.trim();
    if (!nome || !telefone) {
      alert('Por favor preencha o nome e o telefone antes de confirmar.');
      return;
    }

    const message = buildMessage();
    const waNumber = (BookingState.contact && BookingState.contact.whatsapp) || '244945213124';
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

    // Pequena animação cinematográfica antes de abrir o WhatsApp
    overlay.removeAttribute('hidden');
    overlay.classList.add('show');

    setTimeout(() => {
      window.open(url, '_blank');
      overlay.classList.remove('show');
      overlay.setAttribute('hidden', '');
    }, 1500);
  });
})();
