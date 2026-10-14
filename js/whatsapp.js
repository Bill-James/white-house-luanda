(function () {
  const confirmBtn = document.getElementById('confirm-btn');
  const overlay = document.getElementById('confirm-overlay');
  if (!confirmBtn) return;

  function buildMessage() {
    const nome = document.getElementById('f-nome').value.trim() || 'Não informado';
    const telefone = document.getElementById('f-telefone').value.trim() || 'Não informado';
    const obs = document.getElementById('f-obs').value.trim();
    const { lines, total } = BookingState.priceInfo;

    return `Olá. Gostaria de reservar o apartamento.\n\nNome: ${nome}\nTelefone: ${telefone}\n\nHorários:\n${lines.join('\n')}\n\nValor total: ${Pricing.formatKz(total)}\n${obs ? `Observações: ${obs}\n` : ''}\nPagamento total com 24h de antecedência.\nAguardo confirmação.`;
  }

  confirmBtn.addEventListener('click', () => {
    if (!BookingState.priceInfo) return;

    const nome = document.getElementById('f-nome').value.trim();
    const telefone = document.getElementById('f-telefone').value.trim();
    if (!nome || !telefone) {
      alert('Por favor preencha o nome e o telefone antes de confirmar.');
      return;
    }

    const waNumber = (BookingState.contact && BookingState.contact.whatsapp) || '244945213124';
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(buildMessage())}`;

    overlay.removeAttribute('hidden');
    overlay.classList.add('show');

    setTimeout(() => {
      window.open(url, '_blank');
      overlay.classList.remove('show');
      overlay.setAttribute('hidden', '');
    }, 1500);
  });
})();
