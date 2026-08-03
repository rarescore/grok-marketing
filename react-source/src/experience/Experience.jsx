import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, Float, Line, Preload, Sparkles } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function SignalWorld({ progressRef }) {
  const group = useRef()
  const points = useMemo(() => Array.from({length:12},(_,i)=>[
    -5+i*.9, Math.sin(i*.9)*1.1, -1-Math.random()*2
  ]),[])
  useFrame((state,delta)=>{
    const p=progressRef.current
    if(group.current){group.current.rotation.z=THREE.MathUtils.lerp(group.current.rotation.z,p*.55,1-Math.exp(-delta*2));group.current.position.y=Math.sin(state.clock.elapsedTime*.25)*.08}
  })
  return <group ref={group}>
    <Float speed={.7} rotationIntensity={.12} floatIntensity={.18}>
      <Line points={points} color="#d7191c" transparent opacity={.32} lineWidth={1}/>
      {points.filter((_,i)=>i%3===0).map((p,i)=><mesh key={i} position={p}><sphereGeometry args={[.045,12,12]}/><meshBasicMaterial color="#d7191c"/></mesh>)}
    </Float>
    <Sparkles count={36} scale={[12,7,4]} size={1.2} speed={.12} color="#222222" opacity={.17}/>
  </group>
}
export default function Experience({progressRef,reducedMotion}){
  if(reducedMotion)return null
  return <Canvas className="experience" dpr={[1,2]} gl={{alpha:true,antialias:true,powerPreference:'high-performance'}} camera={{position:[0,0,7],fov:40}} aria-hidden="true">
    <ambientLight intensity={1}/><SignalWorld progressRef={progressRef}/><AdaptiveDpr pixelated={false}/><Preload all/>
  </Canvas>
}
