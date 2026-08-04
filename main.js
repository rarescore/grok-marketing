
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.159/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.159/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.159/examples/jsm/controls/OrbitControls.js';
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.13.5/+esm';
import ScrollTrigger from 'https://cdn.jsdelivr.net/npm/gsap@3.13.5/ScrollTrigger/+esm';
gsap.registerPlugin(ScrollTrigger);

const wrapper=document.getElementById('canvas-wrapper');
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(38,window.innerWidth/window.innerHeight,0.1,100);
camera.position.set(4,1.1,6);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setSize(window.innerWidth,window.innerHeight);
wrapper.appendChild(renderer.domElement);

// light
const dir=new THREE.DirectionalLight(0xffffff,2.2);
dir.position.set(5,6,4);
scene.add(dir);

// load model
const loader=new GLTFLoader();
let wheels=[];
loader.load('https://raw.githubusercontent.com/gkjohnson/3d-demo-data/master/models/formula_e_car/FormulaE.glb',g=>{
  const car=g.scene;
  car.traverse(ch=>{
    if(ch.name.toLowerCase().includes('wheel')) wheels.push(ch);
  });
  car.position.set(0,-0.35,0);
  scene.add(car);
});

function resize(){
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
}
window.addEventListener('resize',resize);

let last=0;
function animate(t){
  const delta=(t-last)/1000;
  last=t;
  wheels.forEach(w=>w.rotation.x-=12*delta);
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ScrollTrigger camera move
gsap.timeline({
  scrollTrigger:{trigger:'#hero',start:'top top',end:'+=150%',scrub:true,pin:true}
})
.to(camera.position,{x:-5,y:1,z:4,ease:'none'},0)
.to(camera.rotation,{y:-0.6,ease:'none'},0)

// headlines fade
gsap.utils.toArray('.headline').forEach((el,i)=>{
  const start=0.15+0.3*i;
  gsap.fromTo(el,{opacity:0,y:30},{opacity:1,y:0,
    scrollTrigger:{trigger:'#hero',start:`top+=${start*150}%`,end:`top+=${(start+0.25)*150}%`,scrub:true}});
});
