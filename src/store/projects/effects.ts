import { get } from 'svelte/store'
import { assert, array } from 'superstruct'
import { addOpenedProject, removeOpenedProject } from '/@/store/opened'
import { ProjectStruct } from '/@/utils/validation-structs'
import { _currentProjectId, _projects } from './state'

// Run state validation in development
if (process.env.NODE_ENV !== 'production') {
  _projects.subscribe((state) => {
    assert(state, array(ProjectStruct))
  })
}

let prevProjectId: string | undefined = undefined

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

window.addEventListener('beforeunload', () => {
  removeOpenedProject(get(_currentProjectId))
})
