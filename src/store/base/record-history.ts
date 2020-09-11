import { writable, derived, Writable } from 'svelte/store'
import { applyPatches, produceWithPatches, Patch } from 'immer'
import { uget } from '/@/utils/common'

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

  const historyStack = writable([] as HistoryRecord[])
  const historyIndex = writable(-1)

  const canUndo = derived(historyIndex, ($historyIndex) => {
    return $historyIndex >= 0
  })

  const canRedo = derived(
    [historyStack, historyIndex],
    ([$historyStack, $historyIndex]) => {
      return $historyIndex + 1 < $historyStack.length
    }
  )

  const currentUndoName = derived(
    [historyStack, historyIndex],
    ([$historyStack, $historyIndex]) => {
      return $historyStack[$historyIndex]?.name
    }
  )

  const currentRedoName = derived(
    [historyStack, historyIndex],
    ([$historyStack, $historyIndex]) => {
      return $historyStack[$historyIndex + 1]?.name
    }
  )

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

    const undoPatches = uget(historyStack)[uget(historyIndex)]?.undo

    if (undoPatches != null) {
      store.update((store) => applyPatches(store, undoPatches))
      historyIndex.update((v) => v - 1)
    }
  }

  function redo() {
    const redoPatches = uget(historyStack)[uget(historyIndex) + 1]?.redo

    if (redoPatches != null) {
      store.update((store) => applyPatches(store, redoPatches))
      historyIndex.update((v) => v + 1)
    }
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

    historyStack.update(($historyStack) => {
      // If there's history ahead of now, remove it
      $historyStack.splice(uget(historyIndex) + 1)

      $historyStack.push({ name, undo, redo })

      if (limit != null && $historyStack.length >= limit) {
        $historyStack.shift()
      } else {
        historyIndex.update((v) => v + 1)
      }

      return $historyStack
    })
  }

  function clearHistory() {
    historyStack.set([])
    historyIndex.set(-1)
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
    clear,
    breakMerge: mergeBufferIfExist,
    canUndo,
    canRedo,
    currentUndoName,
    currentRedoName
  }
}
