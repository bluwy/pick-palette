import { get } from 'svelte/store'
import { storageStore } from './base/storage-store'

const openedProjectsKey = 'openedprojects'

// Array of project ids that has been open across windows/tabs
const internalOpenedProjects = storageStore(localStorage, openedProjectsKey, [])

function isProjectOpen(id) {
  return get(internalOpenedProjects).includes(id)
}

function addOpenedProject(id) {
  if (!isProjectOpen(id)) {
    internalOpenedProjects.update((v) => v.concat([id]))
  }
}

function removeOpenedProject(id) {
  if (isProjectOpen(id)) {
    internalOpenedProjects.update((v) => v.filter((u) => u !== id))
  }
}

export const openedProjects = {
  subscribe: internalOpenedProjects.subscribe,
  isOpen: isProjectOpen,
  add: addOpenedProject,
  remove: removeOpenedProject
}
