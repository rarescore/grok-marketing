(function () {
  let cart = null;
  const drawer = document.getElementById('drawer');
  const shade = document.getElementById('shade');
  const mid = document.getElementById('drawer-mid');
  const bot = document.getElementById('drawer-bot');
  const total = document.getElementById('total-val');
  const modal = document.getElementById('modal');

  function open() { drawer.classList.add('open'); shade.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { drawer.classList.remove('open'); shade.classList.remove('open'); document.body.style.overflow = ''; }

  function render() {
    if (!cart) {
      mid.innerHTML = '<p class="empty">Nothing selected yet.</p>';
      bot.hidden = true;
      return;
    }
    const s = cart.id === 'website' ? '' : '/mo';
    mid.innerHTML = `<div class="drawer-item"><div><div class="drawer-item-name">${cart.name}</div><button class="drawer-rm" id="rm">Remove</button></div><div class="drawer-item-price">$${cart.price.toLocaleString()}${s}</div></div>`;
    total.textContent = '$' + cart.price.toLocaleString() + s;
    bot.hidden = false;
    document.getElementById('rm').onclick = () => { cart = null; render(); };
  }

  document.querySelectorAll('.select').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.pkg') || btn;
      cart = {
        id: btn.dataset.id || card.dataset.id,
        name: btn.dataset.name || card.dataset.name,
        price: parseInt(btn.dataset.price || card.dataset.price, 10)
      };
      render(); open();
    });
  });

  document.getElementById('drawer-close')?.addEventListener('click', close);
  shade?.addEventListener('click', close);
  document.getElementById('to-checkout')?.addEventListener('click', () => { close(); modal.classList.add('open'); });
  document.getElementById('modal-x')?.addEventListener('click', () => modal.classList.remove('open'));

  document.getElementById('checkout-form')?.addEventListener('submit', e => {
    e.preventDefault();
    e.target.hidden = true;
    document.getElementById('modal-ok').hidden = false;
    setTimeout(() => {
      modal.classList.remove('open');
      e.target.hidden = false; e.target.reset();
      document.getElementById('modal-ok').hidden = true;
      cart = null; render();
    }, 3000);
  });
})();
