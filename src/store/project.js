import { writable, derived, get } from 'svelte/store'
import { storageStore } from './base/storage-store'

const reservedProjectKey = 'reservedproject'

// Array of project ids that has been open across windows/tabs
export const reservedProjectIds = storageStore(
  localStorage,
  reservedProjectKey,
  []
)

const internalSelectedProjectId = writable(undefined)

export const selectedProjectId = derived(internalSelectedProjectId, (v) => v)

/**
 * @param {string} id
 * @returns {boolean} True if successfully selected, false if id is reserved
 *     (used in other tabs)
 */
export function selectProject(id) {
  if (id === get(internalSelectedProjectId)) {
    return true
  }

  // Check if select id is reserved
  if (get(reservedProjectIds).includes(id)) {
    return false
  }

  // Add id as reserved
  reservedProjectIds.update((v) => v.concat([id]))
  internalSelectedProjectId.set(id)

  return true
}

export function deselectProject() {
  const currentProjectId = get(internalSelectedProjectId)

  // If current id is not reserved, ignore. Otherwise reservedProjectIds.update
  // may trigger an unnecessary storage setItem call
  if (!get(reservedProjectIds).includes(currentProjectId)) {
    return
  }

  // Remove previous id
  reservedProjectIds.update((v) => v.filter((u) => u !== currentProjectId))

  internalSelectedProjectId.set(undefined)
}

window.addEventListener('beforeunload', deselectProject)

// Project UI

// Enum. Can't directly map to view component because of circular dependency
export const editorViews = Object.freeze({
  empty: -1,
  editColor: 0,
  newColor: 1
})

export const currentEditorView = writable(editorViews.empty)

export const editingColorId = writable(undefined)

export const editingColorShadeIndex = writable(-1)
