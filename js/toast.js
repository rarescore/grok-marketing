(function () {
  const box = document.getElementById('toasts');
  if (!box) return;
  const firsts = ['Na','Jo','Al','Ma','Sa','Li','Ch','Em','Da','Ka','Mi','An','Re','Br','So','Ja','El','Ni','Ol','Lu'];
  const lasts = 'ABCDEFGHJKLMNPRSTW';

  function name() {
    return firsts[Math.floor(Math.random()*firsts.length)] + '** ' + lasts[Math.floor(Math.random()*lasts.length)] + '**';
  }

  function show() {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<div class="toast-dot"></div><div class="toast-text"><strong>${name()}</strong> just ordered a new website — <strong>$1,500</strong></div>`;
    box.appendChild(t);
    setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 400); }, 4800);
  }

  setTimeout(() => {
    show();
    setInterval(() => { if (Math.random() > 0.25) show(); }, 20000 + Math.random() * 15000);
  }, 10000 + Math.random() * 5000);
})();
