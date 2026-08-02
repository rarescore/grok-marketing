(function () {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });

  const toggle = document.getElementById('nav-toggle');
  const mobile = document.getElementById('mobile-nav');
  toggle?.addEventListener('click', () => {
    mobile.classList.toggle('open');
    document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
  });
  mobile?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobile.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Funnel
  const funnel = document.getElementById('funnel');
  if (funnel) {
    const steps = funnel.querySelectorAll('.funnel-step');
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        steps.forEach(s => s.classList.add('active'));
        io.unobserve(funnel);
      }
    }, { threshold: 0.35 });
    io.observe(funnel);
  }

  // Score ring
  const progress = document.getElementById('score-progress');
  const value = document.getElementById('score-value');
  if (progress && value) {
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        progress.style.strokeDashoffset = 62;
        let n = 0;
        const t = setInterval(() => {
          n += 2;
          if (n >= 84) { n = 84; clearInterval(t); }
          value.textContent = n;
        }, 28);
        io.unobserve(progress.parentElement);
      }
    }, { threshold: 0.4 });
    io.observe(progress.parentElement);
  }

  document.getElementById('contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    e.target.reset();
    const ok = document.getElementById('form-ok');
    if (ok) { ok.hidden = false; setTimeout(() => ok.hidden = true, 4000); }
  });
})();
