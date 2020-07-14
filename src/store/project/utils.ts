import { currentProjectId, projects } from './state'
import { uget } from '/@/utils/common'
import { Color, Project } from '/@/utils/types'
import { HistoryUpdateOptions } from '/@/store/base/record-history'

// Wrap projects update for current project
export function updateProject(name: string, fn: (store: Project) => void, options?: HistoryUpdateOptions) {
  projects.history.update(
    name,
    (projects) => {
      const $currentProjectId = uget(currentProjectId)
      const project = projects.find((v) => v.id === $currentProjectId)

      if (project == null) {
        throw new Error(
          `Unable to update projects. Invalid id: ${$currentProjectId}`
        )
      }

      fn(project)
    },
    options
  )
}

export function updateColor(colorId: string, name: string, fn: (store: Color) => void, options?: HistoryUpdateOptions) {
  updateProject(
    name,
    (project) => {
      const color = project.colors.find((v) => v.id === colorId)

      if (color == null) {
        throw new Error(`Unable to update color. Invalid id: ${colorId}`)
      }

      fn(color)
    },
    options
  )
}

/**
 * Create color name, e.g. Color 1, Color 2...
 * @param {Object} project
 */
export function getDefaultColorName(project: Project) {
  // Initial color suffix number
  let nameNumber = 1

  while (true) {
    const name = 'Color ' + nameNumber++

    if (!project.colors.some((v) => v.name === name)) {
      return name
    }
  }
}

/**
 * Make sure project name is unique and return final name
 * @param {Object[]} projects
 * @param {string} name
 */
export function coerceProjectName(projects: Project[], name: string) {
  // Yes ugly code ahead
  if (projects.some((v) => v.name === name)) {
    let nameNumber = 1

    while (true) {
      const newName = `${name} (${nameNumber++})`

      if (!projects.some((v) => v.name === name)) {
        return newName
      }
    }
  } else {
    return name
  }
}
