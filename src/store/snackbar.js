import { nanoid } from 'nanoid/non-secure'
import { writable, derived } from 'svelte/store'

/**
 * @typedef {Object} Snack
 * @property {string} id
 * @property {'info' | 'success' | 'warning' | 'error'} type
 * @property {string} message
 * @property {number} timeout
 */

const defaultType = 'info'
const defaultTimeout = 5000

/** @type {import('svelte/store').Writable<Snack[]>} */
const internalSnacks = writable([])

export const snacks = derived(internalSnacks, (v) => v)

/**
 * @param {Snack} snack
 */
export function addSnack(snack) {
  internalSnacks.update((v) =>
    v.concat([
      {
        id: nanoid(3),
        type: snack.type || defaultType,
        message: snack.message,
        timeout: snack.timeout != null ? snack.timeout : defaultTimeout
      }
    ])
  )
}

export function removeSnack(id) {
  internalSnacks.update((v) => v.filter((u) => u.id !== id))
}
