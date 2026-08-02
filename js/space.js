(function () {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('space');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x070b14, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 12;

  // Stars
  const starCount = 1400;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 80;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 50;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 60;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff, size: 0.06, transparent: true, opacity: 0.85,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false
  });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // Gold accent particles
  const goldCount = 200;
  const goldPos = new Float32Array(goldCount * 3);
  for (let i = 0; i < goldCount; i++) {
    goldPos[i * 3] = (Math.random() - 0.5) * 40;
    goldPos[i * 3 + 1] = (Math.random() - 0.5) * 25;
    goldPos[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }
  const goldGeo = new THREE.BufferGeometry();
  goldGeo.setAttribute('position', new THREE.BufferAttribute(goldPos, 3));
  const goldMat = new THREE.PointsMaterial({
    color: 0xeab308, size: 0.09, transparent: true, opacity: 0.5,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  const golds = new THREE.Points(goldGeo, goldMat);
  scene.add(golds);

  // Distant planet
  const planetGeo = new THREE.SphereGeometry(1.8, 32, 32);
  const planetMat = new THREE.MeshBasicMaterial({
    color: 0x1e3a5f, transparent: true, opacity: 0.35
  });
  const planet = new THREE.Mesh(planetGeo, planetMat);
  planet.position.set(-9, -3, -18);
  scene.add(planet);

  // Soft glow sphere (black-hole-ish)
  const holeGeo = new THREE.SphereGeometry(0.6, 24, 24);
  const holeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const hole = new THREE.Mesh(holeGeo, holeMat);
  hole.position.set(7, 2, -12);
  scene.add(hole);

  const ringGeo = new THREE.RingGeometry(0.9, 1.6, 48);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xeab308, transparent: true, opacity: 0.25, side: THREE.DoubleSide
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.copy(hole.position);
  ring.rotation.x = Math.PI / 2.4;
  scene.add(ring);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 1.2;
  });

  function animate() {
    requestAnimationFrame(animate);
    const t = performance.now() * 0.0001;
    stars.rotation.y = t * 0.3;
    golds.rotation.y = -t * 0.5;
    planet.rotation.y = t * 0.8;
    ring.rotation.z = t * 1.2;
    camera.position.x += (mx * 0.8 - camera.position.x) * 0.03;
    camera.position.y += (-my * 0.5 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
