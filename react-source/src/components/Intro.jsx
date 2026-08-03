import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
export default function Intro({onComplete,reducedMotion}){
  const root=useRef(),car=useRef(),portal=useRef(),flash=useRef(),count=useRef()
  useLayoutEffect(()=>{
    if(reducedMotion){onComplete();return}
    const ctx=gsap.context(()=>{
      const state={n:0}
      const tl=gsap.timeline({onComplete})
      tl.fromTo(car.current,{xPercent:-115,yPercent:-48,scale:.78,filter:'blur(3px)'},{xPercent:7,yPercent:-48,scale:1,filter:'blur(0px)',duration:1.45,ease:'power2.out'})
        .to(car.current,{xPercent:-2,scale:1.04,duration:.45,ease:'sine.inOut'})
        .to(car.current,{xPercent:-29,scale:8.8,duration:1.35,ease:'power4.inOut'},'zoom')
        .fromTo(portal.current,{autoAlpha:0,scale:.12},{autoAlpha:1,scale:1,duration:1.15,ease:'expo.out'},'zoom+=.25')
        .to(state,{n:100,duration:1.05,onUpdate:()=>{count.current.textContent=`${Math.round(state.n)}%`}},'zoom+=.25')
        .to(flash.current,{autoAlpha:1,duration:.55,ease:'power2.in'},'>-.05')
      return()=>tl.kill()
    },root)
    return()=>ctx.revert()
  },[onComplete,reducedMotion])
  return <div className="intro" ref={root}><div className="intro-sky"/><div className="intro-barriers"/><div className="intro-track"/><div className="intro-car-wrap" ref={car}><img src="/assets/rs-formula-car.png" alt=""/></div><div className="portal" ref={portal}><img src="/assets/rs-marketing.svg" alt=""/><span>Loading the growth system</span><b ref={count}>0%</b></div><div className="white-flash" ref={flash}/></div>
}
