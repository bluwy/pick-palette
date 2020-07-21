import { produce } from 'immer'
import { nanoid } from 'nanoid/non-secure'
import { get } from 'svelte/store'
import { debounce, download, removeAndInsertElement } from '/@/utils/common'
import { Project } from '/@/utils/types'
import { updateColor, updateProject, getDefaultColorName } from './utils'
import { _projects } from '/@/store/projects/state'
import { _currentProject, _currentProjectId } from './state'

const debounceProjectsHistoryBreakMerge = debounce(
  _projects.history.breakMerge,
  500
)

// Expose this because the current route param is only accessible in Svelte
// components. The Project view will use this only.
export function setCurrentProjectId(id: string) {
  _currentProjectId.set(id)
}

export function exportProject() {
  // Remove ids to reduce output size
  const projectData = produce(get(_currentProject) as Project, (project) => {
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

export function updateColorShade(
  colorId: string,
  shadeIndex: number,
  newShade: string
) {
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
