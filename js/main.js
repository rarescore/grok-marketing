(function () {
  // Header
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile
  const burger = document.getElementById('burger');
  const mobile = document.getElementById('mobile-menu');
  burger?.addEventListener('click', () => {
    mobile.classList.toggle('open');
    document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
  });
  mobile?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobile.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // GSAP animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.hero-badge', { opacity: 1, y: 0, duration: 0.8 }, 0.2)
      .to('.hero-title .line', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.12,
        onStart: function () {
          document.querySelectorAll('.hero-title .line').forEach(line => {
            if (!line.querySelector('span') && !line.querySelector('em')) {
              // already structured
            }
          });
        }
      }, 0.3)
      .to('.hero-title em', { opacity: 1, y: 0, duration: 1 }, 0.45)
      .to('.hero-lead', { opacity: 1, y: 0, duration: 0.8 }, 0.7)
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8 }, 0.85)
      .to('.scroll-hint', { opacity: 1, duration: 0.8 }, 1.2);

    // Fix title lines - wrap text for reveal
    document.querySelectorAll('.hero-title .line').forEach(line => {
      if (line.querySelector('em')) {
        // em already animated
      } else {
        const text = line.textContent;
        line.innerHTML = `<span style="display:inline-block">${text}</span>`;
        gsap.set(line.querySelector('span'), { y: '110%', opacity: 0 });
        gsap.to(line.querySelector('span'), { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.35 });
      }
    });

    // Panels
    document.querySelectorAll('.panel').forEach(panel => {
      ScrollTrigger.create({
        trigger: panel,
        start: 'top 75%',
        onEnter: () => panel.classList.add('active'),
        onEnterBack: () => panel.classList.add('active')
      });
    });

    // Packages
    gsap.to('.pkg', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.pkg-grid', start: 'top 80%' }
    });

    // Testimonials
    gsap.to('.proof-grid blockquote', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.proof-grid', start: 'top 80%' }
    });
  } else {
    // Fallback
    document.querySelectorAll('.hero-badge, .hero-lead, .hero-cta, .scroll-hint').forEach(el => {
      el.style.opacity = 1; el.style.transform = 'none';
    });
    document.querySelectorAll('.hero-title .line, .hero-title em').forEach(el => {
      el.style.opacity = 1; el.style.transform = 'none';
    });
    document.querySelectorAll('.panel, .pkg, .proof-grid blockquote').forEach(el => {
      el.style.opacity = 1; el.style.transform = 'none';
      el.classList.add('active');
    });
  }

  document.getElementById('contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    e.target.reset();
    const ok = document.getElementById('form-ok');
    if (ok) { ok.hidden = false; setTimeout(() => ok.hidden = true, 4000); }
  });
})();
