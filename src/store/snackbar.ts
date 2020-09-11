import { writable } from 'svelte/store'
import { nanoid } from 'nanoid/non-secure'
import { readonly } from '/@/utils/common'

export type SnackType = 'info' | 'success' | 'warning' | 'error'
export type Snack = {
  id: string
  type: SnackType
  message: string
  timeout: number
}

const defaultType: SnackType = 'info'
const defaultTimeout = 5000

const _snacks = writable<Snack[]>([])

export const snacks = readonly(_snacks)

export function addSnack(snack: Snack) {
  const snackId = nanoid(3)

  const realSnack: Snack = {
    id: snackId,
    type: snack.type || defaultType,
    message: snack.message,
    timeout: snack.timeout != null ? snack.timeout : defaultTimeout
  }

  _snacks.update((v) => v.concat([realSnack]))

  return snackId
}

export function removeSnack(id: string) {
  _snacks.update((v) => v.filter((u) => u.id !== id))
}
