import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useExperience } from '../components/ExperienceContext'
import SignalCraft from './SignalCraft'
import { Horizon, WireNetwork, GlassGate, DataPillars, PackageDoors, OrbitSignal, SignalField, Portal } from './SceneObjects'
import { bell, clamp01, damp, range, smooth } from './math'

const craftKeys = [
  [0, [1.5, -.15, .15], [.08, -.25, -.03], 1],
  [.12, [.6, .1, -.2], [.05, .12, -.02], .92],
  [.24, [-3.2, .5, -1.25], [.12, 1.35, .18], .68],
  [.36, [3.8, 1.35, -3.8], [-.12, 2.35, -.18], .38],
  [.48, [1, 2.8, -6.5], [-.35, 3.5, .18], .12],
  [.72, [-1.2, 1.1, -4.8], [.2, 4.4, .3], .12],
  [.88, [-2.2, .5, -2.8], [.02, 5.1, -.18], .2],
  [1, [4.8, 3.2, -5.8], [-.25, 6.3, .38], .08]
]

const cameraKeys = [
  [0, [0, .9, 10.4], [0, -.1, 0]],
  [.18, [1.8, .55, 9.5], [-.7, 0, -1]],
  [.32, [-1.2, .25, 8.4], [.2, .1, -2.1]],
  [.48, [4.2, 1.1, 10.6], [0, .8, -2]],
  [.63, [0, .35, 10.8], [0, .2, -1.4]],
  [.78, [0, 1.1, 10], [0, 0, -1.6]],
  [.9, [-1.2, .4, 9.2], [.3, 0, -2]],
  [1, [0, 0, 10.8], [0, 0, -1.5]]
]

function sample(keys, progress, index) {
  let a = keys[0], b = keys[keys.length - 1]
  for (let i = 0; i < keys.length - 1; i++) {
    if (progress >= keys[i][0] && progress <= keys[i + 1][0]) { a = keys[i]; b = keys[i + 1]; break }
  }
  const t = smooth(clamp01((progress - a[0]) / Math.max(.0001, b[0] - a[0])))
  const av = a[index], bv = b[index]
  if (Array.isArray(av)) return av.map((v, i) => THREE.MathUtils.lerp(v, bv[i], t))
  return THREE.MathUtils.lerp(av, bv, t)
}

function setFade(group, fade) {
  if (!group) return
  group.visible = fade > .004
  group.traverse((child) => {
    if (child.isMaterial) return
    if (child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material]
      materials.forEach((material) => {
        if (material.userData.baseOpacity == null) material.userData.baseOpacity = material.opacity ?? 1
        material.transparent = true
        material.opacity = material.userData.baseOpacity * fade
        material.depthWrite = fade > .95
      })
    }
    if (child.isLight) {
      if (child.userData.baseIntensity == null) child.userData.baseIntensity = child.intensity
      child.intensity = child.userData.baseIntensity * fade
    }
  })
}

export default function World() {
  const { camera, scene } = useThree()
  const { progress, pointer, velocity } = useExperience()
  const craft = useRef(), horizon = useRef(), network = useRef(), glass = useRef(), pillars = useRef(), doors = useRef(), orbit = useRef(), field = useRef(), portal = useRef()
  const target = useMemo(() => new THREE.Vector3(), [])
  const bgA = useMemo(() => new THREE.Color('#070807'), [])
  const bgB = useMemo(() => new THREE.Color('#11100f'), [])
  const bgC = useMemo(() => new THREE.Color('#070a09'), [])
  const bgCurrent = useMemo(() => new THREE.Color('#070807'), [])

  useFrame((state, delta) => {
    const p = clamp01(progress.current)
    const speed = Math.min(1, Math.abs(velocity.current) / 2200)
    const position = sample(craftKeys, p, 1)
    const rotation = sample(craftKeys, p, 2)
    const scale = sample(craftKeys, p, 3)
    if (craft.current) {
      craft.current.position.x = damp(craft.current.position.x, position[0] + pointer.current.x * .18, 4.5, delta)
      craft.current.position.y = damp(craft.current.position.y, position[1] + pointer.current.y * .1, 4.5, delta)
      craft.current.position.z = damp(craft.current.position.z, position[2], 4.5, delta)
      craft.current.rotation.x = damp(craft.current.rotation.x, rotation[0] + pointer.current.y * .035, 4.2, delta)
      craft.current.rotation.y = damp(craft.current.rotation.y, rotation[1] + pointer.current.x * .05, 4.2, delta)
      craft.current.rotation.z = damp(craft.current.rotation.z, rotation[2] - speed * .05, 4.2, delta)
      craft.current.scale.setScalar(damp(craft.current.scale.x, scale, 4.5, delta))
      setFade(craft.current, 1 - bell(p, .38, .58, .82) * .78)
    }

    const camPos = sample(cameraKeys, p, 1)
    const look = sample(cameraKeys, p, 2)
    camera.position.x = damp(camera.position.x, camPos[0] + pointer.current.x * .2, 3.2, delta)
    camera.position.y = damp(camera.position.y, camPos[1] + pointer.current.y * .12, 3.2, delta)
    camera.position.z = damp(camera.position.z, camPos[2], 3.2, delta)
    target.set(look[0], look[1], look[2])
    camera.lookAt(target)

    setFade(horizon.current, 1 - range(p, .18, .34))
    setFade(network.current, bell(p, .08, .22, .4))
    setFade(glass.current, bell(p, .17, .31, .48))
    setFade(pillars.current, bell(p, .32, .48, .64))
    setFade(doors.current, bell(p, .48, .62, .76))
    setFade(orbit.current, bell(p, .66, .78, .92))
    setFade(field.current, range(p, .72, .92))
    setFade(portal.current, range(p, .86, .98))

    if (network.current) network.current.rotation.y = p * .45
    if (glass.current) {
      glass.current.position.x = THREE.MathUtils.lerp(5.5, -.35, smooth(bell(p, .16, .31, .47)))
      glass.current.rotation.y = -.18 + pointer.current.x * .04
    }
    if (pillars.current) pillars.current.position.x = Math.sin(p * 8) * .22
    if (doors.current) doors.current.rotation.y = (p - .62) * .42
    if (orbit.current) orbit.current.rotation.y += delta * .1
    if (field.current) field.current.rotation.y += delta * .014
    if (portal.current) portal.current.rotation.z -= delta * .08

    const t1 = range(p, .18, .5), t2 = range(p, .62, .9)
    bgCurrent.copy(bgA).lerp(bgB, t1).lerp(bgC, t2)
    scene.background = bgCurrent
    if (scene.fog) scene.fog.color.copy(bgCurrent)
  })

  return (
    <>
      <fog attach="fog" args={['#070807', 11, 34]} />
      <ambientLight intensity={.5} color="#dbe4d6" />
      <directionalLight position={[4, 8, 6]} intensity={2.4} color="#e8d7c8" />
      <spotLight position={[-7, 4, 5]} angle={.45} penumbra={.9} intensity={3.2} color="#9db16a" />
      <pointLight position={[5, -1, 2]} intensity={1.8} distance={13} color="#b77a55" />

      <group ref={craft}><SignalCraft /></group>
      <group ref={horizon}><Horizon /></group>
      <group ref={network}><WireNetwork opacity={1} /></group>
      <group ref={glass}><GlassGate opacity={1} /></group>
      <group ref={pillars}><DataPillars opacity={1} spread={1} /></group>
      <group ref={doors}><PackageDoors opacity={1} open={1} /></group>
      <group ref={orbit}><OrbitSignal opacity={1} /></group>
      <group ref={field}><SignalField opacity={1} /></group>
      <group ref={portal}><Portal opacity={1} /></group>
    </>
  )
}
