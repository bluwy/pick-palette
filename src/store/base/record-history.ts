import { applyPatches, produceWithPatches, Patch } from 'immer'
import { uget } from '/@/utils/common'
import { Writable } from 'svelte/store'

export interface HistoryStoreOptions {
  /** Max history record count */
  limit?: number
}

export interface HistoryRecord {
  name: string
  undo: Patch[]
  redo: Patch[]
}

export interface HistoryUpdateOptions {
  /**
   * Whether to merge consecutive calls into one record. Useful to reduce
   * history record spam.
   */
  merge?: boolean
}

/** Record store history for undo/redo actions */
export function recordHistory<T>(
  store: Writable<T>,
  options: HistoryStoreOptions = {}
) {
  const { limit } = options

  let historyStack: HistoryRecord[] = []
  let historyIndex = -1

  /*
    How merge works?

    Updates that can be merged (`options.merge` flag) will place its patches in
    a buffer first, once it's decided to break the merge, the patches will be
    squashed and recorded into the historyStack.
  */

  // Array of inversePatches (undos)
  let mergeBuffer: Patch[] = []
  let bufferName: string | undefined

  /**
   * Updates the store. Use this instead of the usual store update function so
   * that store mutations can be recorded. This uses Immer under the hood so
   * usual mutations will work.
   *
   * It's best to mutate as much as possible so Immer can generate the mutation
   * data at a minimal size.
   *
   * How to mutate data: https://immerjs.github.io/immer/docs/update-patterns
   */
  function update(
    name: string,
    fn: (store: T) => void,
    options: HistoryUpdateOptions = {}
  ) {
    const { merge = false } = options

    store.update((store) => {
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
          // If a non-mergeable update is called after a mergeable update, merge
          mergeBufferIfExist()

          // Add to historyStack as usual
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
      const undoPacthes = historyStack[historyIndex].undo
      store.update((store) => applyPatches(store, undoPacthes))
      historyIndex--
    }
  }

  function redo() {
    if (canRedo()) {
      const redoPatches = historyStack[historyIndex + 1].redo
      store.update((store) => applyPatches(store, redoPatches))
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

    const [, patches, inversePatches] = produceWithPatches(
      uget(store),
      (store) => {
        applyPatches(store, mergeBuffer)
      }
    )

    // Finally add to historyStack
    addHistory(bufferName, patches, inversePatches)

    // Clear up for next buffer
    clearBuffer()
  }

  //#region Private functions

  function addHistory(name: string, undo: Patch[], redo: Patch[]) {
    if (undo.length <= 0 && redo.length <= 0) {
      return
    }

    // If there's history ahead of now, remove it
    if (canRedo()) {
      historyStack.splice(historyIndex + 1)
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

  //#endregion

  return {
    update,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
    breakMerge: mergeBufferIfExist
  }
}
