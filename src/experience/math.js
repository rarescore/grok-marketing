import * as THREE from 'three'

export const clamp01 = (value) => Math.min(1, Math.max(0, value))
export const range = (value, start, end) => clamp01((value - start) / (end - start))
export const bell = (value, start, peak, end) => {
  if (value <= start || value >= end) return 0
  return value < peak ? range(value, start, peak) : 1 - range(value, peak, end)
}
export const smooth = (value) => value * value * (3 - 2 * value)
export const damp = (current, target, lambda, delta) => THREE.MathUtils.damp(current, target, lambda, delta)
