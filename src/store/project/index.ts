import { readonly } from '/@/utils/common'
import { _currentProject, _currentProjectId } from './state'

export const currentProjectId = readonly(_currentProjectId)
export const currentProject = readonly(_currentProject)
export * from './actions'
