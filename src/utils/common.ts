import type { Writable, Readable } from 'svelte/store'

/** Proper math modulus implementation that handles negative `val` */
export function mod(val: number, by: number) {
  return ((val % by) + by) % by
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max))
}

export type Fn = (...args: any[]) => void

export function debounce<T extends Fn>(fn: T, wait: number): T {
  let t: number | undefined
  return function () {
    clearTimeout(t)
    // @ts-ignore
    t = window.setTimeout(() => fn.apply(this, arguments), wait)
  } as T
}

export function throttle<T extends Fn>(fn: T, wait: number): T {
  let t: number | undefined
  return function () {
    if (t == null) {
      // @ts-ignore
      fn.apply(this, arguments)
      t = window.setTimeout(() => (t = undefined), wait)
    }
  } as T
}

export function removeAndInsertElement(
  arr: Array<any>,
  removeIndex: number,
  insertIndex: number
) {
  if (removeIndex === insertIndex) {
    return
  }

  if (insertIndex > removeIndex) {
    insertIndex--
  }

  arr.splice(insertIndex, 0, arr.splice(removeIndex, 1)[0])
}

/**
 * @param t Value between 0 and 1
 */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/**
 * Download a text as a file
 *
 * Reference: https://stackoverflow.com/a/43388258/13265944
 *
 * @param text The text to download
 * @param name The file name
 * @param type The MIME type
 */
export function download(text: string, name: string, type: string) {
  const blob = new Blob([text], { type })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  document.body.appendChild(a)
  a.style.display = 'none'
  a.click()
  a.remove()
}

/** Alternative to Svelte's get function that uses store update function */
export function uget<T>(store: Pick<Writable<T>, 'update'>): T {
  let value: T
  store.update((v) => {
    value = v
    return v
  })
  // @ts-ignore
  return value
}

/** Makes writable store readonly */
export function readonly<T>(
  store: Pick<Writable<T>, 'subscribe'>
): Readable<T> {
  return { subscribe: store.subscribe }
}
