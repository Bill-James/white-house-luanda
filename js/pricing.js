// pricing.js — motor de preços por escalão (automático, conforme número de dias)

const Pricing = (function () {
  let table = [
    { min: 1, max: 1, valor: 32000, label: '1 dia' },
    { min: 2, max: 6, valor: 25000, label: '2 a 6 dias' },
    { min: 7, max: 13, valor: 20000, label: '7 a 13 dias' },
    { min: 14, max: null, valor: 15000, label: '14 dias ou mais' }
  ];

  const NORMAL_RATE = () => table[0].valor; // preço de referência (1 dia) para calcular "preço normal"

  function setTable(newTable) {
    if (Array.isArray(newTable) && newTable.length) table = newTable;
  }

  function tierFor(days) {
    return table.find((t) => days >= t.min && (t.max === null || days <= t.max)) || table[table.length - 1];
  }

  function calculate(days) {
    if (!days || days < 1) return null;

    const tier = tierFor(days);
    const pricePerDay = tier.valor;
    const subtotal = pricePerDay * days;
    const normalPrice = NORMAL_RATE() * days;
    const savings = Math.max(0, normalPrice - subtotal);
    const isMaxDiscount = tier.min === 14;

    return {
      days,
      pricePerDay,
      subtotal,
      normalPrice,
      savings,
      isMaxDiscount,
      tierLabel: tier.label
    };
  }

  function formatKz(value) {
    return new Intl.NumberFormat('pt-AO', { maximumFractionDigits: 0 }).format(value) + ' Kz';
  }

  return { setTable, calculate, formatKz, tierFor };
})();
