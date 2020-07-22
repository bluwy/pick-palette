import { addOpenedProject, removeOpenedProject } from '/@/store/opened'
import { _projects } from '/@/store/projects/state'
import { _currentProjectId } from './state'

let prevProjectId = undefined

// Whenever current project changes, clear history
_currentProjectId.subscribe((currentProjectId) => {
  if (prevProjectId != null) {
    removeOpenedProject(prevProjectId)
  }
  if (currentProjectId != null) {
    addOpenedProject(currentProjectId)
  }
  _projects.history.clear()
  prevProjectId = currentProjectId
})
