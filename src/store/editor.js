import { writable } from 'svelte/store'

// Enum. Can't directly map to view component because of circular dependency
export const editorViews = Object.freeze({
  empty: -1,
  editColor: 0,
  newColor: 1
})

export const currentEditorView = writable(editorViews.empty)

export const editingColorId = writable('')
export const editingColorShadeIndex = writable(-1)
