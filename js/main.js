(function () {
  // Header
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  // Mobile menu
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  menuBtn?.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Reveal
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Counter animation
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const isFloat = target % 1 !== 0;
      let current = 0;
      const steps = 40;
      const increment = target / steps;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = isFloat ? current.toFixed(1) : Math.round(current);
      }, 30);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterIO.observe(c));

  // Funnel animation
  const funnel = document.getElementById('funnel');
  if (funnel) {
    const layers = funnel.querySelectorAll('.funnel-layer');
    const funnelIO = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        layers.forEach(layer => {
          const w = layer.dataset.width;
          layer.style.width = w + '%';
          layer.classList.add('visible');
        });
        funnelIO.unobserve(funnel);
      }
    }, { threshold: 0.3 });
    funnelIO.observe(funnel);
  }

  // Demo score ring
  const demoRing = document.getElementById('demo-ring');
  const demoScore = document.getElementById('demo-score');
  if (demoRing && demoScore) {
    const scoreIO = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        demoRing.style.strokeDashoffset = 65;
        let n = 0;
        const t = setInterval(() => {
          n += 2;
          if (n >= 82) { n = 82; clearInterval(t); }
          demoScore.textContent = n;
        }, 30);
        scoreIO.unobserve(demoRing.parentElement);
      }
    }, { threshold: 0.4 });
    scoreIO.observe(demoRing.parentElement);
  }

  // Contact form
  document.getElementById('contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    e.target.reset();
    const s = document.getElementById('form-success');
    if (s) {
      s.hidden = false;
      setTimeout(() => s.hidden = true, 4000);
    }
  });
})();
