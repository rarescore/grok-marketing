/**
 * Shopping cart experience
 */
(function () {
  let cart = null;
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  const body = document.getElementById('cart-body');
  const footer = document.getElementById('cart-footer');
  const totalEl = document.getElementById('cart-total-price');
  const modal = document.getElementById('checkout-modal');

  function openCart() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderCart() {
    if (!cart) {
      body.innerHTML = '<p class="cart-empty">No package selected yet.</p>';
      footer.hidden = true;
      return;
    }
    body.innerHTML = `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${cart.name}</div>
          <button class="cart-item-remove" id="remove-item">Remove</button>
        </div>
        <div class="cart-item-price">$${cart.price.toLocaleString()}${cart.id === 'website' ? '' : '/mo'}</div>
      </div>
    `;
    totalEl.textContent = '$' + cart.price.toLocaleString() + (cart.id === 'website' ? '' : '/mo');
    footer.hidden = false;

    document.getElementById('remove-item').onclick = () => {
      cart = null;
      renderCart();
    };
  }

  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cart = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseInt(btn.dataset.price, 10)
      };
      renderCart();
      openCart();
    });
  });

  document.getElementById('cart-close')?.addEventListener('click', closeCart);
  overlay?.addEventListener('click', closeCart);

  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    closeCart();
    modal.classList.add('open');
  });

  document.getElementById('modal-close')?.addEventListener('click', () => {
    modal.classList.remove('open');
  });

  document.getElementById('checkout-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    form.hidden = true;
    document.getElementById('modal-success').hidden = false;
    setTimeout(() => {
      modal.classList.remove('open');
      form.hidden = false;
      form.reset();
      document.getElementById('modal-success').hidden = true;
      cart = null;
      renderCart();
    }, 3200);
  });
})();
