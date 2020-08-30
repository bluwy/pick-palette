import chroma from 'chroma-js'
import { lerp } from './common'

export const supportedShadeCount = [5, 7, 9]

export const hueGradient = [
  '#ff0000',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#0000ff',
  '#ff00ff',
  '#ff0000'
]

export function findById<T extends { id: string }>(arr: T[], id?: string) {
  const found = arr.find((v) => v.id === id)

  if (found == null) {
    throw new Error(`Id of "${id}" not found.`)
  }

  return found
}

// Reference: https://maketintsandshades.com/
export function genShadeTint(color: string, shadeCount: number) {
  // Color is the base/center color
  const [r, g, b] = chroma(color).rgb()
  const halfCount = Math.ceil(shadeCount / 2)
  const maxTintAndShade = 0.9

  // Tint makes brighter (Reference term)
  const tint = (t: number) =>
    chroma(lerp(r, 255, t), lerp(g, 255, t), lerp(b, 255, t)).hex()

  // Shade makes darker (Reference term)
  const shade = (t: number) =>
    chroma(lerp(r, 0, t), lerp(g, 0, t), lerp(b, 0, t)).hex()

  // Create tint and shade values from center to outer
  // and remove first element since it's 0
  const tintAndShadeValues = Array.from({ length: halfCount }, (_, k) =>
    lerp(0, maxTintAndShade, k / (halfCount - 1))
  ).slice(1)

  return [
    ...tintAndShadeValues.reverse().map(tint),
    color,
    ...tintAndShadeValues.reverse().map(shade)
  ]
}
