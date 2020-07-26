import { derived } from 'svelte/store'
import { readonly } from '/@/utils/common'
import {
  _currentProjectId,
  _currentColorId,
  _currentShadeIndex,
  _projects
} from './state'
import './effects'

export const {
  canUndo,
  canRedo,
  currentUndoName,
  currentRedoName
} = _projects.history

export const projects = readonly(_projects)
export const currentProjectId = readonly(_currentProjectId)
export const currentColorId = readonly(_currentColorId)
export const currentShadeIndex = readonly(_currentShadeIndex)

export const currentProject = derived(
  [projects, currentProjectId],
  ([$projects, $currentProjectId]) => {
    return $projects.find((v) => v.id === $currentProjectId)
  }
)

export const currentColor = derived(
  [currentProject, currentColorId],
  ([$currentProject, $currentColorId]) => {
    return $currentProject?.colors.find((v) => v.id === $currentColorId)
  }
)

export const currentShade = derived(
  [currentColor, currentShadeIndex],
  ([$currentColor, $currentShadeIndex]) => {
    return $currentColor?.shades[$currentShadeIndex]
  }
)

export * from './actions'
