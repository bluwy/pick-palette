import { get } from 'svelte/store'
import { activeRoute } from 'svelte-router-spa/src/store'
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

activeRoute.subscribe((v) => {
  // On page load, add project id if available.
  // TODO: Use page load events (Require router support)
  if (v.namedParams && v.namedParams.projectid) {
    addOpenedProject(v.namedParams.projectid)
  }
})

window.addEventListener('beforeunload', () => {
  // Remove current opened project
  const openedProjectId = get(activeRoute).namedParams.projectid
  removeOpenedProject(openedProjectId)
})
