import { nanoid } from 'nanoid/non-secure'
import {
  object,
  number,
  array,
  string,
  defaulted,
  refinement
} from 'superstruct'
import { supportedShadeCount } from './app'

const ID = defaulted(string(), () => nanoid(10))

export const Color = object({
  id: ID,
  name: string(),
  shades: lengthOneOf(array(string()), supportedShadeCount)
})

export const Project = object({
  id: ID,
  name: string(),
  colors: defaulted(array(Color), () => [])
})

export const State = object({
  version: number(),
  selected: defaulted(number(), -1),
  projects: defaulted(array(Project), () => [])
})

/**
 * Validate value length to be one of allowed lengths
 * @param {import('superstruct').Struct<T>} S Struct
 * @param {number[]} arr Array of allowed lengths
 * @returns Struct<T>
 * @template T
 */
function lengthOneOf(S, arr) {
  return refinement(
    S,
    `${S.type} & LengthOneOf<[${arr.join(', ')}]>`,
    (value) => {
      return arr.includes(value.length)
    }
  )
}
