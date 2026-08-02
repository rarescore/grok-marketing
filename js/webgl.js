/**
 * Three.js ambient particle field
 */
(function () {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('webgl');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5;

  const count = 900;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    sizes[i] = Math.random() * 2.5 + 0.5;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    color: 0xc9a227,
    size: 0.04,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // Subtle second layer
  const positions2 = new Float32Array(300 * 3);
  for (let i = 0; i < 300; i++) {
    positions2[i * 3] = (Math.random() - 0.5) * 14;
    positions2[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions2[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  const geo2 = new THREE.BufferGeometry();
  geo2.setAttribute('position', new THREE.BufferAttribute(positions2, 3));
  const mat2 = new THREE.PointsMaterial({
    color: 0xe0c15a,
    size: 0.025,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const points2 = new THREE.Points(geo2, mat2);
  scene.add(points2);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.6;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  function animate() {
    requestAnimationFrame(animate);
    const t = performance.now() * 0.00015;
    points.rotation.y = t * 0.4 + mouseX * 0.3;
    points.rotation.x = t * 0.15 + mouseY * 0.2;
    points2.rotation.y = -t * 0.25 + mouseX * 0.15;
    points2.rotation.x = t * 0.1;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
