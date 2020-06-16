import { writable, derived } from 'svelte/store'
import produce, { applyPatches } from 'immer'

// Svelte store with histort functionailty (undo/redo)
export function historyStore(value, options) {
  const { maxHistoryStack } = options
  const historyStack = []
  let historyIndex = -1

  const internalStore = writable(value)
  const store = derived(internalStore, (v) => v)

  /**
   * Use to update state. fn is a function with first argument of the proxied
   * state. All mutations should be done on the proxied state. More info:
   * https://immerjs.github.io/immer/docs/produce
   */
  const dispatch = (fn, noHistory = false) => {
    internalStore.update((v) =>
      produce(v, fn, (patches, inversePatches) => {
        if (!noHistory) {
          // If there's history ahead of current, remove it cuz we're rewriting it :D
          if (historyIndex < historyStack.length) {
            historyStack.splice(historyIndex)
          }

          historyStack.push({
            undo: inversePatches,
            redo: patches
          })

          // Check reach history limit and remove earliest history
          if (
            maxHistoryStack != null &&
            historyStack.length >= maxHistoryStack
          ) {
            historyStack.shift()
          } else {
            historyIndex++
          }
        }
      })
    )
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
    if (historyIndex < historyStack.length - 1) {
      internalStore.update((v) =>
        applyPatches(v, historyStack[historyIndex].redo)
      )
      historyIndex++
    }
  }

  return { store, dispatch, undo, redo }
}
