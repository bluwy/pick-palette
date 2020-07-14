import { nanoid } from 'nanoid/non-secure'
import {
  array,
  defaulted,
  number,
  object,
  refinement,
  string,
  Struct
} from 'superstruct'
import { supportedShadeCount } from './app'

/*
  NOTE: The validation structs below are mainly used for

  1. Coerce and validate initial state.
  2. Validate state during development.
  3. Validate imported data.

  The coercing functionality shall not be relied upon when updating state,
  that means the default keys below are still required throughout the app.

  In other words, coercing is only used for user inputs, NOT for app updates.
*/

/*
  SIDE NOTE:

  I would have implemented coercing for app updates if superstruct were to
  mutate the object when setting default values. But the way it works is by
  recreating the object when coercing it. This way Immer is unable to detect
  branch changes and the generated patches is just the entire root object.
*/

const ID = defaulted(string(), () => nanoid(6))

export const ColorStruct = object({
  id: ID,
  name: string(),
  shades: lengthOneOf(array(string()), supportedShadeCount)
})

export const ProjectStruct = object({
  version: number(),
  id: ID,
  name: string(),
  colors: defaulted(array(ColorStruct), () => [])
})

/**
 * Validate value length to be one of allowed lengths
 * @param S Struct
 * @param Array of allowed lengths
 */
function lengthOneOf<T extends { length: number }>(S: Struct<T>, arr: number[]) {
  return refinement(
    S,
    `${S.type} & LengthOneOf<[${arr.join(', ')}]>`,
    (value) => arr.includes(value.length)
  )
}
