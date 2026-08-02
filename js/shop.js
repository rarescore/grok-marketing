(function () {
  let cart = null;
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  const body = document.getElementById('drawer-body');
  const footer = document.getElementById('drawer-footer');
  const totalEl = document.getElementById('drawer-total');
  const modal = document.getElementById('modal');

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function render() {
    if (!cart) {
      body.innerHTML = '<p class="drawer-empty">Nothing selected yet.</p>';
      footer.hidden = true;
      return;
    }
    const suffix = cart.id === 'website' ? '' : '/mo';
    body.innerHTML = `
      <div class="drawer-item">
        <div>
          <div class="drawer-item-name">${cart.name}</div>
          <button class="drawer-remove" id="remove-item">Remove</button>
        </div>
        <div class="drawer-item-price">$${cart.price.toLocaleString()}${suffix}</div>
      </div>
    `;
    totalEl.textContent = '$' + cart.price.toLocaleString() + suffix;
    footer.hidden = false;
    document.getElementById('remove-item').onclick = () => { cart = null; render(); };
  }

  document.querySelectorAll('.select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.package') || btn;
      cart = {
        id: btn.dataset.id || card.dataset.id,
        name: btn.dataset.name || card.dataset.name,
        price: parseInt(btn.dataset.price || card.dataset.price, 10)
      };
      render();
      openDrawer();
    });
  });

  document.getElementById('drawer-close')?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    closeDrawer();
    modal.classList.add('open');
  });
  document.getElementById('modal-close')?.addEventListener('click', () => modal.classList.remove('open'));

  document.getElementById('checkout-form')?.addEventListener('submit', e => {
    e.preventDefault();
    e.target.hidden = true;
    document.getElementById('modal-ok').hidden = false;
    setTimeout(() => {
      modal.classList.remove('open');
      e.target.hidden = false;
      e.target.reset();
      document.getElementById('modal-ok').hidden = true;
      cart = null;
      render();
    }, 3000);
  });
})();
