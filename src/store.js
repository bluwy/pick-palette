import { writable, derived } from 'svelte/store'
import produce, { applyPatches } from 'immer'

// Key used for web storage saves
const stateKey = 'ppdata'

// State version for future migrations
const stateVersion = 1

// Default if none in web storage
const defaultState = {
  version: stateVersion,
  selected: -1,
  projects: []
}

// Get initial data from web storage
const stateStr = localStorage.getItem(stateKey)
const initialState = stateStr ? JSON.parse(stateStr) : defaultState

// Main state, but don't export this because we only allow writes via dispatch
const internalState = writable(initialState)

// Undo/redo
const historyStack = []
const historyMaxLength = 50
let historyIndex = -1

// Save to web storage on every state change
internalState.subscribe((v) =>
  localStorage.setItem(stateKey, JSON.stringify(v))
)

// Read-only state
export const state = derived(internalState, (v) => v)

/**
 * Use to update state. fn is a function with first argument of the proxied
 * state. All mutations should be done on the proxied state. More info:
 * https://immerjs.github.io/immer/docs/produce
 */
export function dispatch(fn, noHistory = false) {
  internalState.update((v) =>
    produce(v, fn, (patches, inversePatches) => {
      if (!noHistory) {
        pushHistory(inversePatches, patches)
      }
    })
  )
}

function pushHistory(undo, redo) {
  // If there's history ahead of current, remove it cuz we're rewriting it :D
  if (historyIndex < historyStack.length) {
    historyStack.splice(historyIndex)
  }

  historyStack.push({ undo, redo })

  if (historyStack.length < historyMaxLength) {
    historyIndex++
  } else {
    // Reach history limit, remove earliest history.
    historyStack.shift()
  }
}

export function undo() {
  if (historyIndex >= 0) {
    internalState.update((v) =>
      applyPatches(v, historyStack[historyIndex].undo)
    )
    historyIndex--
  }
}

export function redo() {
  if (historyIndex < historyStack.length - 1) {
    internalState.update((v) =>
      applyPatches(v, historyStack[historyIndex].redo)
    )
    historyIndex++
  }
}
