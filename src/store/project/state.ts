import { assert, array, StructType } from 'superstruct'
import { derived, writable, Readable } from 'svelte/store'
import { synchronize } from '/@/store/base/synchronize'
import { recordHistory } from '/@/store/base/record-history'
import { Project } from '/@/utils/validation-structs'

//#region Projects

const _projects = writable([] as StructType<typeof Project>[])

export const projects = {
  ..._projects,
  synchronize: synchronize(_projects, 'pp:projects'),
  history: recordHistory(_projects, { limit: 50 })
}

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
) as Readable<StructType<typeof Project>>

//#endregion

//#region Opened projects

const _openedProjectIds = writable([] as string[])

export const openedProjectIds = {
  ..._openedProjectIds,
  synchronize: synchronize(_openedProjectIds, 'pp:opened')
}

//#endregion
