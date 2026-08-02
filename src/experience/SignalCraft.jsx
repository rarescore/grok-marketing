import { useMemo } from 'react'
import * as THREE from 'three'

function makeWingGeometry() {
  const shape = new THREE.Shape()
  shape.moveTo(-3.7, 0.05)
  shape.lineTo(-1.45, 1.15)
  shape.lineTo(1.95, 0.53)
  shape.lineTo(3.55, 0.12)
  shape.lineTo(1.5, -0.08)
  shape.lineTo(0.35, -0.48)
  shape.lineTo(-2.7, -0.35)
  shape.closePath()
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.16, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.07, bevelThickness: 0.06 })
  geometry.center()
  geometry.rotateX(Math.PI / 2)
  geometry.computeVertexNormals()
  return geometry
}

function makeFinGeometry() {
  const shape = new THREE.Shape()
  shape.moveTo(-.55, 0)
  shape.lineTo(.42, 0)
  shape.lineTo(-.15, 1.1)
  shape.closePath()
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: .08, bevelEnabled: true, bevelSize: .03, bevelThickness: .03 })
  geometry.center()
  return geometry
}

export default function SignalCraft({ opacity = 1 }) {
  const wing = useMemo(makeWingGeometry, [])
  const fin = useMemo(makeFinGeometry, [])
  const metal = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0b0d0c', metalness: .96, roughness: .2, envMapIntensity: 1.1, transparent: true }), [])
  metal.opacity = opacity
  const edge = useMemo(() => new THREE.MeshStandardMaterial({ color: '#9caf6a', emissive: '#7f954e', emissiveIntensity: 2.4, metalness: .4, roughness: .25, transparent: true }), [])
  edge.opacity = opacity
  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#9fb7ae', roughness: .04, transmission: .55, thickness: .22, metalness: .15, transparent: true, opacity: .68 }), [])
  glass.opacity = Math.min(.74, opacity)

  return (
    <group rotation={[0, -Math.PI / 2, 0]}>
      <mesh geometry={wing} material={metal} castShadow />
      <mesh position={[0, .09, .07]} scale={[.18, 1.48, .25]} material={metal} castShadow>
        <capsuleGeometry args={[.36, 3.8, 8, 24]} />
      </mesh>
      <mesh position={[0, .12, 2.34]} rotation={[Math.PI / 2, 0, 0]} material={metal} castShadow>
        <coneGeometry args={[.32, 1.25, 24]} />
      </mesh>
      <mesh position={[0, .33, .86]} scale={[.42, .2, .84]} material={glass}>
        <sphereGeometry args={[.68, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {[-.66, .66].map((x) => (
        <group key={x} position={[x, -.01, -.72]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={metal} castShadow><cylinderGeometry args={[.25, .34, 2.25, 24]} /></mesh>
          <mesh position={[0, 0, -1.16]} rotation={[Math.PI / 2, 0, 0]} material={edge}><cylinderGeometry args={[.17, .24, .08, 24]} /></mesh>
          <pointLight position={[0, 0, -1.42]} intensity={opacity * 3.2} distance={4} color="#b6ca75" />
        </group>
      ))}
      {[-1, 1].map((x) => <mesh key={x} geometry={fin} position={[x * .72, .5, -1.45]} rotation={[0, 0, x * -.12]} material={metal} />)}
      <mesh position={[0, -.08, -.18]} scale={[.015, .012, 2.5]} material={edge}><boxGeometry /></mesh>
    </group>
  )
}
