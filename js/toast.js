/**
 * Social proof purchase notifications
 * Shows random "Na** just ordered a new website – $1,500"
 */
(function () {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const firstNames = [
    'Na', 'Jo', 'Al', 'Ma', 'Sa', 'Li', 'Ch', 'Em', 'Da', 'Ka',
    'Mi', 'An', 'Re', 'Br', 'So', 'Ja', 'El', 'Ni', 'Ol', 'Lu'
  ];
  const lastInitials = 'ABCDEFGHJKLMNPRSTW';

  function randomName() {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastInitials[Math.floor(Math.random() * lastInitials.length)];
    return first + '** ' + last + '**';
  }

  function showToast() {
    const name = randomName();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-dot"></div>
      <div class="toast-text"><strong>${name}</strong> just ordered a new website — <strong>$1,500</strong></div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 450);
    }, 4800);
  }

  // First toast after 8–14s, then every 18–35s
  setTimeout(() => {
    showToast();
    setInterval(() => {
      if (Math.random() > 0.3) showToast();
    }, 18000 + Math.random() * 17000);
  }, 8000 + Math.random() * 6000);
})();
