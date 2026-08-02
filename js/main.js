(function () {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  const burger = document.getElementById('burger');
  const mobile = document.getElementById('mobile');
  burger?.addEventListener('click', () => {
    mobile?.classList.toggle('open');
    document.body.style.overflow = mobile?.classList.contains('open') ? 'hidden' : '';
  });
  mobile?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobile.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Journey blocks
  const blocks = document.querySelectorAll('.journey-block');
  if (blocks.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.3 });
    blocks.forEach(b => io.observe(b));
  } else {
    blocks.forEach(b => b.classList.add('active'));
  }

  // GSAP if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero-tag, .hero-h1, .hero-p, .hero-btns', {
      opacity: 0, y: 28, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15
    });
  }
})();
