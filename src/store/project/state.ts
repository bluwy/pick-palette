import { writable, derived, Readable } from 'svelte/store'
import { _projects } from '/@/store/projects/state'
import { Project } from '/@/utils/types'

// TODO: Use different router that provides a global active route store
export const _currentProjectId = writable(undefined)

export const _currentProject = derived(
  [_projects, _currentProjectId],
  ([$_projects, $currentProjectId]) => {
    return $_projects.find((v) => v.id === $currentProjectId)
  }
) as Readable<Project>
