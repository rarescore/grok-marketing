import { useMemo } from 'react'
import * as THREE from 'three'
import { Line, RoundedBox } from '@react-three/drei'

export function Horizon({ opacity = 1 }) {
  const points = useMemo(() => Array.from({ length: 65 }, (_, i) => {
    const x = (i - 32) * .48
    return new THREE.Vector3(x, -1.8, -5 - Math.sin(i * .53) * .23)
  }), [])
  return (
    <group>
      <Line points={points} color="#b68a64" transparent opacity={opacity * .55} lineWidth={1} />
      <mesh position={[0, -2, -4.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#080a09" roughness={.45} metalness={.18} transparent opacity={opacity} />
      </mesh>
    </group>
  )
}

export function WireNetwork({ opacity = 0 }) {
  const lines = useMemo(() => {
    const output = []
    for (let i = 0; i < 18; i++) {
      const y = -2.1 + i * .24
      output.push([new THREE.Vector3(-7, y, -4.4 - i * .05), new THREE.Vector3(7, y * .18, -7.2)])
    }
    for (let i = 0; i < 14; i++) {
      const x = -5 + i * .77
      output.push([new THREE.Vector3(x, -2.1, -4.4), new THREE.Vector3(x * .18, 1.6, -7.2)])
    }
    return output
  }, [])
  return <group>{lines.map((points, index) => <Line key={index} points={points} color={index % 4 === 0 ? '#a8bd6c' : '#344039'} transparent opacity={opacity * (index % 4 === 0 ? .48 : .22)} lineWidth={1} />)}</group>
}

export function GlassGate({ opacity = 0, position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[4.7, 6.6, .12]} radius={.06} smoothness={5}>
        <meshPhysicalMaterial color="#c6b6aa" transmission={.72} transparent opacity={opacity * .38} roughness={.1} thickness={.32} metalness={.05} />
      </RoundedBox>
      <mesh position={[-2.41, 0, 0]}><boxGeometry args={[.025, 6.8, .18]} /><meshBasicMaterial color="#d2b298" transparent opacity={opacity} /></mesh>
      <mesh position={[2.41, 0, 0]}><boxGeometry args={[.025, 6.8, .18]} /><meshBasicMaterial color="#7f9257" transparent opacity={opacity * .7} /></mesh>
    </group>
  )
}

export function DataPillars({ opacity = 0, spread = 1 }) {
  const heights = [2.1, 4.4, 3.3, 5.7, 2.8, 4.9, 3.6, 5.2, 2.4, 4.1]
  return (
    <group position={[0, -1.6, -1.2]}>
      {heights.map((height, index) => (
        <RoundedBox key={index} args={[.62, height, .72]} radius={.08} smoothness={3} position={[(index - 4.5) * .88 * spread, height / 2, (index % 2) * .35]}>
          <meshStandardMaterial color={index % 3 === 0 ? '#927258' : '#151918'} metalness={.78} roughness={.28} transparent opacity={opacity * (.72 + index * .018)} />
        </RoundedBox>
      ))}
    </group>
  )
}

export function PackageDoors({ opacity = 0, open = 0 }) {
  const names = ['S', 'G', 'S', 'E']
  return (
    <group position={[0, -.1, -1.5]}>
      {names.map((name, index) => {
        const x = (index - 1.5) * 2.05
        const angle = (index - 1.5) * -.08 * open
        return (
          <group key={`${name}-${index}`} position={[x * (1 + open * .1), 0, Math.abs(index - 1.5) * -.35]} rotation={[0, angle, 0]}>
            <RoundedBox args={[1.62, 5.3, .24]} radius={.08} smoothness={4}>
              <meshStandardMaterial color={index === 1 ? '#293022' : '#111413'} metalness={.82} roughness={.24} transparent opacity={opacity} />
            </RoundedBox>
            <mesh position={[0, 0, .14]}><planeGeometry args={[1.18, 4.55]} /><meshBasicMaterial color={index === 1 ? '#a7bd6a' : '#3b423d'} transparent opacity={opacity * .12} /></mesh>
          </group>
        )
      })}
    </group>
  )
}

export function OrbitSignal({ opacity = 0, phase = 0 }) {
  return (
    <group rotation={[.2, phase, -.12]}>
      {[2.2, 3.2, 4.3].map((radius, index) => (
        <mesh key={radius} rotation={[Math.PI / 2 + index * .18, index * .35, 0]}>
          <torusGeometry args={[radius, .015 + index * .006, 8, 160]} />
          <meshBasicMaterial color={index === 1 ? '#a7bd6a' : '#8b6a54'} transparent opacity={opacity * (.56 - index * .1)} />
        </mesh>
      ))}
      <mesh><icosahedronGeometry args={[1.05, 4]} /><meshStandardMaterial color="#0c100e" metalness={.7} roughness={.35} transparent opacity={opacity} /></mesh>
      <pointLight color="#a7bd6a" intensity={opacity * 4} distance={8} />
    </group>
  )
}

export function SignalField({ opacity = 0 }) {
  const positions = useMemo(() => {
    const array = new Float32Array(900 * 3)
    for (let i = 0; i < 900; i++) {
      const r = 3 + Math.random() * 9
      const a = Math.random() * Math.PI * 2
      const h = (Math.random() - .5) * 7
      array[i * 3] = Math.cos(a) * r
      array[i * 3 + 1] = h
      array[i * 3 + 2] = Math.sin(a) * r - 3
    }
    return array
  }, [])
  return (
    <points>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#a7bd6a" size={.025} transparent opacity={opacity * .72} sizeAttenuation />
    </points>
  )
}

export function Portal({ opacity = 0, rotation = 0 }) {
  return (
    <group rotation={[0, 0, rotation]}>
      {[1.6, 2.1, 2.7, 3.4].map((radius, index) => (
        <mesh key={radius} rotation={[Math.PI / 2, index * .2, 0]}>
          <torusGeometry args={[radius, .025 + index * .012, 10, 180]} />
          <meshBasicMaterial color={index % 2 ? '#a7bd6a' : '#d09468'} transparent opacity={opacity * (.72 - index * .11)} />
        </mesh>
      ))}
      <pointLight color="#a7bd6a" intensity={opacity * 6} distance={10} />
    </group>
  )
}
