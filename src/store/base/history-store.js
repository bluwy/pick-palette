import { applyPatches, produceWithPatches } from 'immer'
import { writable, get } from 'svelte/store'

/**
 * @typedef {Object} HistoryStoreOptions
 * @property {number} [limit] Max history record count
 */

/**
 * Create a store with undo/redo feature
 * @param {T} value
 * @param {HistoryStoreOptions} options
 * @template T
 */
export function historyStore(value, options = {}) {
  const { limit } = options
  const internalStore = writable(value)

  // Array of { name, undo, redo }
  let historyStack = []
  let historyIndex = -1

  // Array of inversePatches (undos)
  let mergeBuffer = []
  let bufferName

  /**
   * @callback UpdateFn
   * @param {T} store
   * @return {void}
   */

  /**
   * @typedef {Object} UpdateOptions
   * @property {boolean} [merge] Whether to merge consecutive calls into one
   *     record. Useful to reduce history record spam.
   */

  /**
   * @param {string} name
   * @param {UpdateFn} fn
   * @param {UpdateOptions} options
   */
  function update(name, fn, options = {}) {
    const { merge = false } = options

    internalStore.update((store) => {
      const [newStore, patches, inversePatches] = produceWithPatches(store, fn)

      // If name exist, record history
      if (name != null) {
        // But if merge is true, record inversePatches into mergeBuffer first
        if (merge) {
          // If name not equal, it means we create a new buffer
          if (name !== bufferName) {
            // Before that, merge previous buffer if exist
            mergeBufferIfExist()
            bufferName = name
          }

          mergeBuffer.unshift(...inversePatches)
        } else {
          // No buffer, we can directly add to historyStack
          addHistory(name, inversePatches, patches)
        }
      }

      return newStore
    })
  }

  function undo() {
    // Merge existing buffer for undo to revert to initial state
    mergeBufferIfExist()

    if (canUndo()) {
      internalStore.update((store) =>
        applyPatches(store, historyStack[historyIndex].undo)
      )
      historyIndex--
    }
  }

  function redo() {
    if (canRedo()) {
      internalStore.update((store) =>
        applyPatches(store, historyStack[historyIndex + 1].redo)
      )
      historyIndex++
    }
  }

  function canUndo() {
    return historyIndex >= 0
  }

  function canRedo() {
    return historyIndex + 1 < historyStack.length
  }

  /** Clears all history and buffer */
  function clear() {
    clearHistory()
    clearBuffer()
  }

  /** Merge buffer patches and insert as single history record */
  function mergeBufferIfExist() {
    if (bufferName == null || mergeBuffer.length <= 0) {
      return
    }

    const store = get(internalStore)

    const [, patches, inversePatches] = produceWithPatches(store, (store) => {
      applyPatches(store, mergeBuffer)
    })

    // Finally add to historyStack
    addHistory(bufferName, patches, inversePatches)

    // Clear up for next buffer
    clearBuffer()
  }

  function addHistory(name, undo, redo) {
    if (undo.length <= 0 && redo.length <= 0) {
      return
    }

    historyStack.push({ name, undo, redo })

    if (limit != null && historyStack.length >= limit) {
      historyStack.shift()
    } else {
      historyIndex++
    }
  }

  function clearHistory() {
    historyStack = []
    historyIndex = -1
  }

  function clearBuffer() {
    mergeBuffer = []
    bufferName = undefined
  }

  return {
    subscribe: internalStore.subscribe,
    update,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
    breakMerge: mergeBufferIfExist
  }
}
