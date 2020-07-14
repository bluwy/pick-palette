import { produce } from 'immer'
import { nanoid } from 'nanoid/non-secure'
import { coerce, StructType } from 'superstruct'
import { get } from 'svelte/store'
import {
  debounce,
  download,
  removeAndInsertElement,
  uget
} from '/@/utils/common'
import { Project } from '/@/utils/validation-structs'
import { openedProjectIds, projects, currentProject } from './state'
import {
  updateColor,
  updateProject,
  getDefaultColorName,
  coerceProjectName
} from './utils'

const debounceProjectsHistoryBreakMerge = debounce(
  projects.history.breakMerge,
  500
)

//#region Project

/*
  Q: Why undo `projects` not current projects?

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

export const projectUndo = projects.history.undo
export const projectRedo = projects.history.redo

export function createProject(name: string) {
  const projectId = nanoid(6)

  projects.history.update('Create new project', (projects) => {
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
  const projectData = coerce(data, Project)
  const $projects = uget(projects)

  // Make sure there's no duplicate id, if the user supplied one
  if ($projects.some((v) => v.id === projectData.id)) {
    projectData.id = nanoid(6)
  }

  // Make sure name is unique, will generate a new name if name clash
  projectData.name = coerceProjectName($projects, projectData.name)

  projects.history.update('Import project', (projects) => {
    projects.push(projectData)
  })

  return projectData.id
}

export function exportProject() {
  // Remove ids to reduce output size
  const projectData = produce(get(currentProject) as StructType<typeof Project>, (project) => {
    delete project.id

    for (let i = 0; i < project.colors.length; i++) {
      delete project.colors[i].id
    }
  })

  const finalText = JSON.stringify(projectData)
  const fileName = projectData.name + '.json'
  const fileType = 'application/json'

  download(finalText, fileName, fileType)
}

//#endregion

//#region Color

export function createColor(shades: string[]) {
  const colorId = nanoid(6)

  updateProject('Create new color', (project) => {
    project.colors.push({
      id: colorId,
      name: getDefaultColorName(project),
      shades
    })
  })

  return colorId
}

export function sortColor(removeIndex: number, insertIndex: number) {
  updateProject('Sort color order', (project) => {
    removeAndInsertElement(project.colors, removeIndex, insertIndex)
  })
}

export function updateColorName(colorId: string, name: string) {
  updateColor(colorId, 'Update color name', (color) => {
    color.name = name
  })
}

export function updateColorShade(colorId: string, shadeIndex: number, newShade: string) {
  updateColor(
    colorId,
    `Update shade ${colorId}`,
    (color) => {
      color.shades[shadeIndex] = newShade
    },
    { merge: true }
  )

  debounceProjectsHistoryBreakMerge()
}

export function removeColor(colorId: string) {
  updateProject('Remove color', (project) => {
    const index = project.colors.findIndex((v) => v.id === colorId)
    project.colors.splice(index, 1)
  })
}

//#endregion

//#region Opened projects

export function addOpenedProject(id: string) {
  openedProjectIds.update((v) => v.concat([id]))
}

export function removeOpenedProject(id: string) {
  openedProjectIds.update((v) => v.filter((u) => u !== id))
}

//#endregion
