(function () {
  const cursor = document.getElementById('cursor');
  const trailCanvas = document.getElementById('cursor-trail');
  if (!cursor || !trailCanvas || window.matchMedia('(max-width: 900px)').matches) return;

  const core = cursor.querySelector('.cursor-core');
  const aura = cursor.querySelector('.cursor-aura');
  const ctx = trailCanvas.getContext('2d');
  let w, h, mx = -100, my = -100, ax = -100, ay = -100;
  const particles = [];
  const MAX = 22;

  function resize() {
    w = trailCanvas.width = window.innerWidth;
    h = trailCanvas.height = window.innerHeight;
  }

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    particles.push({ x: mx, y: my, life: 1, size: 3 + Math.random() * 3 });
    if (particles.length > MAX) particles.shift();
  });

  function loop() {
    // Smooth aura follow
    ax += (mx - ax) * 0.12;
    ay += (my - ay) * 0.12;
    cursor.style.transform = `translate(${mx}px, ${my}px)`;
    aura.style.transform = `translate(${ax - mx}px, ${ay - my}px) translate(-50%, -50%)`;
    core.style.transform = 'translate(-50%, -50%)';

    // Trail
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.life -= 0.04;
      if (p.life <= 0) continue;
      const s = p.size * p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,162,39,${p.life * 0.28})`;
      ctx.fill();
    }
    while (particles.length && particles[0].life <= 0) particles.shift();

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  loop();

  // Hover state
  const targets = 'a, button, .pkg, .btn, input, select, textarea';
  document.querySelectorAll(targets).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
})();
