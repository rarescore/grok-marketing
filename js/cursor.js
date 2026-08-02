(function () {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower || window.matchMedia('(max-width: 900px)').matches) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animate() {
    fx += (mx - fx) * 0.15;
    fy += (my - fy) * 0.15;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  document.querySelectorAll('a, button, .magnetic, .product-card').forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hover'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
  });
})();
