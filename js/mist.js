/**
 * Premium mouse-following mist / particle trail
 * Optimized for performance + mobile (disabled on touch)
 */
(function () {
  const canvas = document.getElementById('mist-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let isTouch = false;

  const MAX_PARTICLES = 90;
  const COLORS = [
    'rgba(201,162,39,0.18)',
    'rgba(201,162,39,0.12)',
    'rgba(255,255,255,0.06)',
    'rgba(180,140,40,0.14)'
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticle(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.6 + 0.15;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.2,
      life: 1,
      decay: Math.random() * 0.012 + 0.006,
      size: Math.random() * 3.5 + 1.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
  }

  function onMove(e) {
    if (isTouch) return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    // Spawn a few particles near cursor
    for (let i = 0; i < 2; i++) {
      if (particles.length < MAX_PARTICLES) {
        particles.push(createParticle(
          mouse.x + (Math.random() - 0.5) * 18,
          mouse.y + (Math.random() - 0.5) * 18
        ));
      }
    }
  }

  function detectTouch() {
    isTouch = true;
    canvas.style.display = 'none';
  }

  function animate() {
    if (isTouch) return;
    ctx.clearRect(0, 0, width, height);

    // Soft ambient glow near mouse
    if (mouse.x > 0) {
      const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
      g.addColorStop(0, 'rgba(201,162,39,0.07)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(mouse.x - 120, mouse.y - 120, 240, 240);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.size *= 0.992;

      if (p.life <= 0 || p.size < 0.3) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(/[\d.]+\)$/, (p.life * 0.35).toFixed(3) + ')');
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchstart', detectTouch, { once: true });

  resize();
  animate();
})();
