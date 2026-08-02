(function () {
  const box = document.getElementById('toasts');
  if (!box) return;

  const firsts = ['Na','Jo','Al','Ma','Sa','Li','Ch','Em','Da','Ka','Mi','An','Re','Br','So','Ja','El','Ni','Ol','Lu','Ty','Ke','Ra','Vi'];
  const lasts = 'ABCDEFGHJKLMNPRSTW';

  const products = [
    { name: 'Starter plan', price: '$500/mo' },
    { name: 'Growth plan', price: '$1,000/mo' },
    { name: 'Scale plan', price: '$2,000/mo' },
    { name: 'Empire plan', price: '$5,000/mo' },
    { name: '100/100 SEO Website', price: '$1,500' },
    { name: '100/100 SEO Website', price: '$1,500' },
    { name: 'Growth plan', price: '$1,000/mo' }
  ];

  function name() {
    return firsts[Math.floor(Math.random()*firsts.length)] + '** ' + lasts[Math.floor(Math.random()*lasts.length)] + '**';
  }

  function show() {
    const p = products[Math.floor(Math.random()*products.length)];
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<div class="toast-dot"></div><div class="toast-text"><strong>${name()}</strong> just ordered <strong>${p.name}</strong> — ${p.price}</div>`;
    box.appendChild(t);
    setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 400); }, 5000);
  }

  setTimeout(() => {
    show();
    setInterval(() => { if (Math.random() > 0.2) show(); }, 16000 + Math.random() * 14000);
  }, 8000 + Math.random() * 4000);
})();
