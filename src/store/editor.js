import { writable } from 'svelte/store'
import EditorNewColor from '../views/EditorNewColor.svelte'

export const editorViews = {
  newColor: EditorNewColor
}

export const currentEditorView = writable(undefined)
