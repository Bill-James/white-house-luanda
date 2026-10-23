(function () {
  const confirmBtn = document.getElementById('confirm-btn');
  const overlay = document.getElementById('confirm-overlay');
  if (!confirmBtn) return;

  const form = confirmBtn.parentElement;
  const done = document.getElementById('done');
  const doneMsg = document.getElementById('done-msg');
  const doneButtons = document.getElementById('done-buttons');
  let lastUrl = '';

  const showForm = (on) => [...form.children].forEach((c) => (c.style.display = (c === done) === on ? 'none' : ''));

  const reset = () => {
    ['f-nome', 'f-telefone', 'f-email', 'f-obs'].forEach((id) => (document.getElementById(id).value = ''));
    document.dispatchEvent(new CustomEvent('booking:reset'));
  };

  function buildMessage() {
    const nome = document.getElementById('f-nome').value.trim() || 'Não informado';
    const telefone = document.getElementById('f-telefone').value.trim() || 'Não informado';
    const obs = document.getElementById('f-obs').value.trim();
    const { lines, total } = BookingState.priceInfo;
    const food = BookingState.foodInfo;

    return `Olá. Gostaria de reservar o apartamento.\n\nNome: ${nome}\nTelefone: ${telefone}\n\nHorários:\n${lines.join('\n')}\n\n${food ? `Comida (para o apartamento):\n${food.lines.join('\n')}\n\n` : ''}Valor total: ${Pricing.formatKz(total + (food ? food.total : 0))}\n${obs ? `Observações: ${obs}\n` : ''}\nPagamento total com 24h de antecedência.\nAguardo confirmação.`;
  }

  confirmBtn.addEventListener('click', () => {
    if (!BookingState.priceInfo) return;

    const nome = document.getElementById('f-nome').value.trim();
    const telefone = document.getElementById('f-telefone').value.trim();
    if (!nome || !telefone) {
      alert('Por favor preencha o nome e o telefone antes de confirmar.');
      return;
    }

    const waNumber = (BookingState.contact && BookingState.contact.whatsapp) || '244923881741';
    lastUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(buildMessage())}`;

    overlay.removeAttribute('hidden');
    overlay.classList.add('show');

    setTimeout(() => {
      window.open(lastUrl, '_blank');
      overlay.classList.remove('show');
      overlay.setAttribute('hidden', '');
      doneMsg.textContent = 'O WhatsApp foi aberto com a sua reserva. Só fica registada depois de enviar a mensagem.';
      doneButtons.style.display = 'flex';
      showForm(false);
    }, 1500);
  });

  document.getElementById('done-retry').addEventListener('click', () => window.open(lastUrl, '_blank'));

  document.getElementById('done-new').addEventListener('click', () => {
    reset();
    showForm(true);
    document.getElementById('disponibilidade').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('done-end').addEventListener('click', () => {
    reset();
    doneMsg.textContent = 'Obrigado pela sua preferência. Até breve.';
    doneButtons.style.display = 'none';
    document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
  });
})();
