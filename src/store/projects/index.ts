import { derived } from 'svelte/store'
import { readonly } from '/@/utils/common'
import {
  _currentProjectId,
  _currentColorId,
  _currentShadeIndex,
  _projects
} from './state'
import './effects'

export const projects = readonly(_projects)
export const currentProjectId = readonly(_currentProjectId)
export const currentColorId = readonly(_currentColorId)
export const currentShadeIndex = readonly(_currentShadeIndex)

export const currentProject = derived(
  [_projects, _currentProjectId],
  ([$_projects, $currentProjectId]) => {
    return $_projects.find((v) => v.id === $currentProjectId)
  }
)

export * from './actions'
