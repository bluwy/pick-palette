import { writable, derived, get } from 'svelte/store'
import { applyPatches, produce } from 'immer'

/**
 * @typedef {Object} HistoryStoreOptions
 * @property {number} [maxHistoryStack] Max history record count
 * @property {Function} [beforeUpdate] Function that runs before updating store. If defined, function must return truthy to continue update, otherwise it will not update store.
 */

/**
 * Create a store with undo/redo feature
 * @param {T} value
 * @param {HistoryStoreOptions} [options]
 * @template T
 */
export function historyStore(value, options = {}) {
  const { maxHistoryStack, beforeUpdate } = options
  const historyStack = []
  let historyIndex = -1

  const internalStore = writable(value)
  const store = derived(internalStore, (v) => v)

  /**
   * Use to update state. fn is a function with first argument of the proxied
   * state. All mutations should be done on the proxied state. More info:
   * https://immerjs.github.io/immer/docs/produce
   *
   * @callback DispatchFn
   * @param {T} store
   * @return {void}
   *
   * @param {DispatchFn} fn
   * @param {boolean} noHistory
   */
  const dispatch = (fn, noHistory = false) => {
    const store = get(internalStore)
    let newStore
    let patches
    let inversePatches

    if (noHistory) {
      // Use normal produce sinve we dont need to generate patches,
      // which slightly improves produce performance
      newStore = produce(store, fn)
    } else {
      newStore = produce(store, fn, (a, b) => {
        patches = a
        inversePatches = b
      })
    }

    // Before altering history, run beforeUpdate hook for validation.
    // If beforeUpdate returns falsy, exit
    if (beforeUpdate && !beforeUpdate(newStore)) {
      return
    }

    internalStore.update(() => newStore)

    if (patches && inversePatches) {
      // If there's history ahead of current, remove it cuz we're rewriting it :D
      if (historyIndex < historyStack.length) {
        historyStack.splice(historyIndex)
      }

      historyStack.push({
        undo: inversePatches,
        redo: patches
      })

      // Check reach history limit and remove earliest history
      if (maxHistoryStack != null && historyStack.length >= maxHistoryStack) {
        historyStack.shift()
      } else {
        historyIndex++
      }
    }
  }

  const undo = () => {
    if (historyIndex >= 0) {
      internalStore.update((v) =>
        applyPatches(v, historyStack[historyIndex].undo)
      )
      historyIndex--
    }
  }

  const redo = () => {
    if (historyIndex + 1 < historyStack.length) {
      internalStore.update((v) =>
        applyPatches(v, historyStack[historyIndex + 1].redo)
      )
      historyIndex++
    }
  }

  return { store, dispatch, undo, redo }
}
