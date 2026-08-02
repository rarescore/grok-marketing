/**
 * Soft ambient particle background
 */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.size = Math.random() * 1.8 + 0.4;
    this.alpha = Math.random() * 0.25 + 0.05;
  }

  function init() {
    particles = [];
    const count = Math.min(60, Math.floor(w * h / 18000));
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,162,39,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize();
  init();
  draw();
})();
