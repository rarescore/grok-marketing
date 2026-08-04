import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.179.1/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'https://cdn.jsdelivr.net/npm/three@0.179.1/examples/jsm/environments/RoomEnvironment.js';

const canvas=document.querySelector('#scene');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.35;
renderer.shadowMap.enabled=true;

const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(0x08101b,.055);
const camera=new THREE.PerspectiveCamera(34,innerWidth/innerHeight,.1,100);
camera.position.set(8,2.3,7.5);

const pmrem=new THREE.PMREMGenerator(renderer);
scene.environment=pmrem.fromScene(new RoomEnvironment(renderer),.04).texture;

scene.add(new THREE.HemisphereLight(0x8dcfff,0x101018,2.0));
const key=new THREE.DirectionalLight(0xffffff,4.2);key.position.set(4,7,6);key.castShadow=true;scene.add(key);
const pink=new THREE.PointLight(0xfd4084,45,16);pink.position.set(-2,2,-4);scene.add(pink);
const blue=new THREE.PointLight(0x00a4ef,55,18);blue.position.set(4,2,3);scene.add(blue);

const ground=new THREE.Mesh(new THREE.PlaneGeometry(120,30),new THREE.MeshStandardMaterial({color:0x111318,roughness:.58,metalness:.2}));
ground.rotation.x=-Math.PI/2;ground.position.y=0;ground.receiveShadow=true;scene.add(ground);

for(let i=-20;i<80;i+=4){
  const line=new THREE.Mesh(new THREE.PlaneGeometry(2.2,.1),new THREE.MeshBasicMaterial({color:0xe8e8e8}));
  line.rotation.x=-Math.PI/2;line.position.set(i,.012,0);scene.add(line);
}

let car,wheels=[];
new GLTFLoader().load('./models/rs-formula.glb',g=>{
  car=g.scene;
  car.scale.setScalar(.82);
  car.rotation.y=-Math.PI/2;
  car.position.set(-5,.42,0);
  car.traverse(o=>{
    if(o.isMesh){o.castShadow=true;o.receiveShadow=true}
    if(o.name.toLowerCase().includes('wheel'))wheels.push(o)
  });
  scene.add(car);
},undefined,e=>console.error(e));

function resize(){
  const w=innerWidth,h=innerHeight;
  renderer.setSize(w,h,false);
  camera.aspect=w/h;camera.updateProjectionMatrix();
}
addEventListener('resize',resize);resize();

const hero=document.querySelector('.hero');
const headline=document.querySelector('#headline');
const subline=document.querySelector('#subline');
const speed=document.querySelector('#speed');
const visibility=document.querySelector('#visibility');
const progress=document.querySelector('.progress');
let target=0,p=0,last=performance.now();

const copy=[
  ['THE RACE<br>STARTS BEFORE<br><span>THE CLICK.</span>','Attention becomes revenue when every system works together.'],
  ['BUILD SPEED.<br>TAKE THE<br><span>LEAD.</span>','Web, SEO, creative and media moving as one machine.'],
  ['EVERY SIGNAL.<br>MEASURED<br><span>LIVE.</span>','Real tracking. Real optimization. No guessing.'],
  ['ENGINEERED<br>TO BE<br><span>FOUND.</span>','Your next customer is already searching.']
];

addEventListener('scroll',()=>{
  const r=hero.getBoundingClientRect();
  target=Math.max(0,Math.min(1,-r.top/(hero.offsetHeight-innerHeight)));
  progress.style.transform=`scaleX(${scrollY/(document.documentElement.scrollHeight-innerHeight)})`;
},{passive:true});

function animate(now){
  requestAnimationFrame(animate);
  const dt=Math.min(.05,(now-last)/1000);last=now;
  p+=(target-p)*.075;
  if(car){
    car.position.x=THREE.MathUtils.lerp(-6,7.5,p);
    car.position.z=Math.sin(p*Math.PI*1.35)*-.7;
    car.position.y=.42+Math.sin(now*.004)*.018;
    car.rotation.z=Math.sin(p*Math.PI*2)*.012;
    wheels.forEach(w=>w.rotation.z-=dt*(8+p*24));
  }
  camera.position.x=THREE.MathUtils.lerp(8,-5,p);
  camera.position.y=THREE.MathUtils.lerp(2.3,1.1,p);
  camera.position.z=THREE.MathUtils.lerp(7.5,4.2,p);
  camera.lookAt(THREE.MathUtils.lerp(0,2,p),.55,0);
  ground.position.x=(p*8)%4;

  const idx=Math.min(3,Math.floor(p*4));
  headline.innerHTML=copy[idx][0];
  subline.textContent=copy[idx][1];
  speed.textContent=String(Math.round(70+p*260)).padStart(3,'0')+' KM/H';
  visibility.textContent=String(Math.round(p*100)).padStart(2,'0')+'%';

  renderer.render(scene,camera);
}
requestAnimationFrame(animate);