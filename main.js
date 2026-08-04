
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.159/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.159/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.13.5/+esm';
import ScrollTrigger from 'https://cdn.jsdelivr.net/npm/gsap@3.13.5/ScrollTrigger/+esm';
gsap.registerPlugin(ScrollTrigger);

const container=document.getElementById('canvas');
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.1,100);
camera.position.set(5,1.1,7);
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
container.appendChild(renderer.domElement);

const light=new THREE.DirectionalLight(0xffffff,2.2);light.position.set(5,6,4);scene.add(light);

const loader=new GLTFLoader();
const wheels=[];
loader.load('/models/FormulaE.glb',g=>{
  const car=g.scene;
  car.traverse(c=>{if(c.name.toLowerCase().includes('wheel')) wheels.push(c)});
  car.position.set(0,-.35,0);
  scene.add(car);
});

addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);
});

let last=0;
function anim(t){const d=(t-last)/1000;last=t;wheels.forEach(w=>w.rotation.x-=10*d);renderer.render(scene,camera);requestAnimationFrame(anim)}
requestAnimationFrame(anim);

gsap.timeline({scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:true}})
 .to(camera.position,{x:-5,z:4,ease:'none'},0)
 .to(camera.rotation,{y:-.6,ease:'none'},0);

gsap.utils.toArray('.headline').forEach((h,i)=>{
  const start=.15+.25*i;
  gsap.fromTo(h,{opacity:0,y:24},{opacity:1,y:0,
    scrollTrigger:{trigger:'#hero',start:`top+=${start*100}%`,end:`top+=${(start+.2)*100}%`,scrub:true}});
});
