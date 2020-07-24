import { produce } from 'immer'
import { nanoid } from 'nanoid/non-secure'
import { coerce } from 'superstruct'
import { findById } from '/@/utils/app'
import {
  debounce,
  download,
  removeAndInsertElement,
  uget
} from '/@/utils/common'
import { Project } from '/@/utils/types'
import { ProjectStruct } from '/@/utils/validation-structs'
import { _currentColorId, _currentProjectId, _projects } from './state'
import {
  coerceProjectName,
  computeColorIdOptions,
  computeProjectIdOptions,
  computeShadeIdOptions,
  getDefaultColorName,
  ColorIdOptions,
  ProjectIdOptions,
  ShadeIdOptions
} from './utils'

const debounceProjectsHistoryBreakMerge = debounce(
  _projects.history.breakMerge,
  500
)

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

//#region Project

export function createProject(name?: string) {
  const projectId = nanoid(6)

  _projects.history.update('Create new project', (projects) => {
    projects.push({
      id: projectId,
      version: 1,
      name: coerceProjectName(projects, name ?? 'Untitled'),
      colors: []
    })
  })

  return projectId
}

export function importProject(data: Object) {
  const projectData = coerce(data, ProjectStruct) as Project

  _projects.history.update('Import project', (projects) => {
    // Make sure there's no duplicate id, if the user supplied one
    if (projects.some((v) => v.id === projectData.id)) {
      projectData.id = nanoid(6)
    }

    // Make sure name is unique, will generate a new name if name clash
    projectData.name = coerceProjectName(projects, projectData.name)

    projects.push(projectData)
  })

  return projectData.id
}

export function exportProject(options?: ProjectIdOptions) {
  const { projectId } = computeProjectIdOptions(options)
  const project = findById(uget(_projects), projectId)

  // Remove ids to reduce output size
  const projectData = produce(project, (project) => {
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

export function renameProject(name: string, options?: ProjectIdOptions) {
  const { projectId } = computeProjectIdOptions(options)

  _projects.history.update('Rename project', (projects) => {
    const project = findById(projects, projectId)
    project.name = name
  })
}

export function removeProject(options?: ProjectIdOptions) {
  const { projectId } = computeProjectIdOptions(options)

  _projects.history.update('Remove project', (projects) => {
    const index = projects.findIndex((v) => v.id === projectId)
    if (index > 0) {
      projects.splice(index, 1)
    }
  })
}

//#endregion

//#region Color

export function createColor(shades: string[], options?: ProjectIdOptions) {
  const { projectId } = computeProjectIdOptions(options)
  const colorId = nanoid(6)

  _projects.history.update('Create new color', (projects) => {
    const project = findById(projects, projectId)
    project.colors.push({
      id: colorId,
      name: getDefaultColorName(project),
      shades
    })
  })

  return colorId
}

export function sortColor(
  removeIndex: number,
  insertIndex: number,
  options?: ProjectIdOptions
) {
  const { projectId } = computeProjectIdOptions(options)

  _projects.history.update('Sort color order', (projects) => {
    const project = findById(projects, projectId)
    removeAndInsertElement(project.colors, removeIndex, insertIndex)
  })
}

export function updateColorName(name: string, options?: ColorIdOptions) {
  const { projectId, colorId } = computeColorIdOptions(options)

  _projects.history.update('Update color name', (projects) => {
    const project = findById(projects, projectId)
    const color = findById(project.colors, colorId)
    color.name = name
  })
}

export function updateColorShade(newShade: string, options?: ShadeIdOptions) {
  const { projectId, colorId, shadeIndex } = computeShadeIdOptions(options)

  _projects.history.update(
    `Update shade ${colorId}`,
    (projects) => {
      const project = findById(projects, projectId)
      const color = findById(project.colors, colorId)
      color.shades[shadeIndex] = newShade
    },
    { merge: true }
  )

  debounceProjectsHistoryBreakMerge()
}

export function removeColor(options?: ColorIdOptions) {
  const { projectId, colorId } = computeColorIdOptions(options)

  _projects.history.update('Remove color', (projects) => {
    const project = findById(projects, projectId)
    const index = project.colors.findIndex((v) => v.id === colorId)
    project.colors.splice(index, 1)
  })
}

//#endregion
