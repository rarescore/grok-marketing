"use client";
import {useEffect,useRef,useState} from "react";
const TOTAL_FRAMES=130;
const FRAME_PATH=(i:number)=>`/car-frames/rs-car-${String(i+1).padStart(3,"0")}.webp`;
const WAVES=[
 {k:"01 / ATTENTION",a:"THE RACE",b:"STARTS BEFORE",c:"THE CLICK."},
 {k:"02 / ACCELERATION",a:"BUILD SPEED.",b:"TAKE THE",c:"LEAD."},
 {k:"03 / CONTROL",a:"EVERY SIGNAL.",b:"MEASURED",c:"LIVE."},
 {k:"04 / FINISH",a:"ENGINEERED",b:"TO BE",c:"FOUND."}
];
export default function Hero(){
 const canvasRef=useRef<HTMLCanvasElement|null>(null);
 const [images,setImages]=useState<HTMLImageElement[]>([]);
 const [loaded,setLoaded]=useState(false);
 const [progress,setProgress]=useState(0);
 useEffect(()=>{let alive=true,count=0;const imgs:HTMLImageElement[]=[];for(let i=0;i<TOTAL_FRAMES;i++){const im=new Image();im.src=FRAME_PATH(i);im.onload=()=>{count++;if(alive&&count===TOTAL_FRAMES){setImages(imgs);setLoaded(true)}};imgs.push(im)}return()=>{alive=false}},[]);
 useEffect(()=>{if(!loaded)return;let raf=0;const run=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const hero=document.getElementById("hero");if(!hero)return;const r=hero.getBoundingClientRect();const total=hero.offsetHeight-innerHeight;const p=Math.max(0,Math.min(1,-r.top/Math.max(1,total)));setProgress(p);draw(Math.floor(p*(TOTAL_FRAMES-1)))})};addEventListener("scroll",run,{passive:true});addEventListener("resize",run);run();return()=>{removeEventListener("scroll",run);removeEventListener("resize",run);cancelAnimationFrame(raf)}},[loaded,images]);
 function draw(index:number){const c=canvasRef.current;if(!c||!images[index])return;const ctx=c.getContext("2d");if(!ctx)return;const dpr=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight;c.width=w*dpr;c.height=h*dpr;c.style.width=w+"px";c.style.height=h+"px";ctx.setTransform(dpr,0,0,dpr,0,0);const im=images[index],cr=w/h,ir=im.width/im.height;let dw=w,dh=h,dx=0,dy=0;if(ir>cr){dh=h;dw=im.width*(h/im.height);dx=(w-dw)/2}else{dw=w;dh=im.height*(w/im.width);dy=(h-dh)/2}ctx.drawImage(im,dx,dy,dw,dh)}
 const wave=Math.min(3,Math.floor(progress*4)); const local=(progress*4)%1; const txt=WAVES[wave];
 const opacity=Math.sin(Math.min(1,local)*Math.PI);
 return <section id="hero" className="hero"><div className="sticky"><canvas ref={canvasRef}/><div className="shade"/><nav><b>RS <i>MEDIA</i></b><span>WORK&nbsp;&nbsp; SERVICES&nbsp;&nbsp; PRICING</span><button>BOOK A CALL ↗</button></nav><div className="copy" style={{opacity,transform:`translateY(${(1-opacity)*34}px)`}}><small>{txt.k}</small><h1>{txt.a}<br/>{txt.b}<br/><em>{txt.c}</em></h1></div><div className="telemetry"><span>SPEED <b>{Math.round(88+progress*238)} KM/H</b></span><span>VISIBILITY <b>{Math.round(progress*100)}%</b></span></div><div className="scroll">SCROLL TO DRIVE</div>{!loaded&&<div className="loading">LOADING 130 CINEMATIC FRAMES…</div>}</div></section>
}