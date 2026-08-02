(function () {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const canvas = document.getElementById('trail-canvas');
  if (!dot || !ring || !canvas || window.matchMedia('(max-width: 900px)').matches) return;

  const ctx = canvas.getContext('2d');
  let w, h, mx = -100, my = -100, rx = -100, ry = -100;
  const trail = [];
  const MAX = 18;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    trail.push({ x: mx, y: my, life: 1 });
    if (trail.length > MAX) trail.shift();
  });

  function loop() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';

    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < trail.length; i++) {
      const p = trail[i];
      p.life -= 0.045;
      if (p.life <= 0) continue;
      const size = 2.5 + (1 - p.life) * 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,162,39,${p.life * 0.22})`;
      ctx.fill();
    }
    // clean dead
    while (trail.length && trail[0].life <= 0) trail.shift();

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  loop();

  document.querySelectorAll('a, button, .package, .magnetic').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
})();
