import { assert, array } from 'superstruct'
import { derived, writable } from 'svelte/store'
import { synchronize } from '/@/store/base/synchronize'
import { recordHistory } from '/@/store/base/record-history'
import { Project } from '/@/utils/validation-structs'

//#region Projects

export const projects = writable([])

synchronize(projects, 'pp:projects')

projects.history = recordHistory(projects, { limit: 50 })

// Run state validation in development
if (process.env.NODE_ENV !== 'production') {
  projects.subscribe((state) => {
    assert(state, array(Project))
  })
}

//#endregion

//#region Current project

// TODO: Use different router that provides a global active route store
export const currentProjectId = writable(undefined)

// Whenever current project changes, clear history
currentProjectId.subscribe(() => {
  projects.history.clear()
})

export const currentProject = derived(
  [projects, currentProjectId],
  ([$projects, $currentProjectId]) => {
    return $projects.find((v) => v.id === $currentProjectId)
  }
)

//#endregion

//#region Opened projects

export const openedProjectIds = writable([])

synchronize(openedProjectIds, 'pp:opened')

//#endregion
