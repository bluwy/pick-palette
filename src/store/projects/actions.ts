import { nanoid } from 'nanoid/non-secure'
import { coerce } from 'superstruct'
import { uget } from '/@/utils/common'
import { ProjectStruct } from '/@/utils/validation-structs'
import { _projects } from './state'
import { coerceProjectName } from './utils'

/*
  Q: Why undo `projects` not current project?

  A: Because the history only exist at `projects` level, but this doesn't mean
  other project's history are all jumbled up together. When changing projects,
  the history is automatically cleared.

  Q: Why history only exist at `projects` level?

  A: Making the history at `project` level is soooo tricky. The history needs to
  work with a writable store and in order to scope to project level, I would
  have to derive `projects` to as a writable store, which Svelte doesn't provide
  natively.

  There's https://github.com/PixievoltNo1/svelte-writable-derived to help with
  it, but I'm leaning to KISS.

  Plus, I needed to record history when modifying the projects array anyways.
*/

export const projectUndo = _projects.history.undo
export const projectRedo = _projects.history.redo

export function createProject(name: string) {
  const projectId = nanoid(6)

  _projects.history.update('Create new project', (projects) => {
    projects.push({
      id: projectId,
      version: 1,
      name,
      colors: []
    })
  })

  return projectId
}

export function importProject(data: Object) {
  const projectData = coerce(data, ProjectStruct)
  const $projects = uget(_projects)

  // Make sure there's no duplicate id, if the user supplied one
  if ($projects.some((v) => v.id === projectData.id)) {
    projectData.id = nanoid(6)
  }

  // Make sure name is unique, will generate a new name if name clash
  projectData.name = coerceProjectName($projects, projectData.name)

  _projects.history.update('Import project', (projects) => {
    projects.push(projectData)
  })

  return projectData.id
}
