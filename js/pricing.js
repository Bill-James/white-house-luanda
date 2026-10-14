const Pricing = (function () {
  let table = [
    { id: 'h8', grupo: 'Manhã · por hora', label: '8h–9h', h: 8, valor: 7500 },
    { id: 'h9', grupo: 'Manhã · por hora', label: '9h–10h', h: 9, valor: 7500 },
    { id: 'h10', grupo: 'Manhã · por hora', label: '10h–11h', h: 10, valor: 7500 },
    { id: 'h11', grupo: 'Manhã · por hora', label: '11h–12h', h: 11, valor: 7500 },
    { id: 't12', grupo: 'Tarde · blocos de 2h seguidas', label: '12h–14h', h: 12, valor: 15000 },
    { id: 't14', grupo: 'Tarde · blocos de 2h seguidas', label: '14h–16h', h: 14, valor: 15000 },
    { id: 't16', grupo: 'Tarde · blocos de 2h seguidas', label: '16h–18h', h: 16, valor: 15000 },
    { id: 'n19', grupo: 'Noite', label: '19h–7h', h: 19, valor: 20000 }
  ];

  const setTable = (t) => { if (Array.isArray(t) && t.length) table = t; };
  const getTable = () => table;
  const find = (id) => table.find((s) => s.id === id);
  const bookable = (date, slot) => new Date(`${date}T${String(slot.h).padStart(2, '0')}:00:00`) - Date.now() >= 24 * 36e5;
  const formatKz = (v) => new Intl.NumberFormat('pt-AO', { maximumFractionDigits: 0 }).format(v) + ' Kz';
  const fmtDate = (d) => new Date(`${d}T00:00:00`).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long' });

  const calculate = (items) => items.length
    ? {
        count: items.length,
        total: items.reduce((s, i) => s + find(i.id).valor, 0),
        lines: items.map((i) => `${fmtDate(i.date)} · ${find(i.id).label} · ${formatKz(find(i.id).valor)}`)
      }
    : null;

  return { setTable, getTable, find, bookable, formatKz, calculate };
})();
