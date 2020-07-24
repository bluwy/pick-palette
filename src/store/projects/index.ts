import { readonly } from '/@/utils/common'
import {
  _currentProject,
  _currentProjectId,
  _currentColorId,
  _currentShadeIndex,
  _projects
} from './state'
import './effects'

export const projects = readonly(_projects)
export const currentProject = readonly(_currentProject)
export const currentProjectId = _currentProjectId
export const currentColorId = _currentColorId
export const currentShadeIndex = _currentShadeIndex
export * from './actions'
