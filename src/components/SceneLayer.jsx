import { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'

const World = lazy(() => import('../experience/World'))

export default function SceneLayer({ enableWebGL, reducedMotion }) {
  if (!enableWebGL || reducedMotion) {
    return <div className="scene-fallback" aria-hidden="true"><div className="scene-fallback__craft" /><div className="scene-fallback__line" /></div>
  }
  return (
    <div className="scene-layer" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }} camera={{ fov: 34, near: .1, far: 80, position: [0, .9, 10.4] }}>
        <Suspense fallback={null}><World /><AdaptiveDpr pixelated /></Suspense>
      </Canvas>
    </div>
  )
}
