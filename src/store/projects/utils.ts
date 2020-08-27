import { get } from 'svelte/store'
import { Project } from '/@/utils/types'
import { findById } from '/@/utils/app'
import { mod, uget } from '/@/utils/common'
import {
  _currentProjectId,
  _currentColorId,
  _currentShadeIndex,
  _projects
} from './state'

export interface ProjectIdOptions {
  projectId?: string
}

export interface ColorIdOptions extends ProjectIdOptions {
  colorId?: string
}

export interface ShadeIdOptions extends ColorIdOptions {
  shadeIndex?: number
}

export function computeProjectIdOptions(options?: ProjectIdOptions) {
  const projectId = options?.projectId ?? get(_currentProjectId)
  return { projectId }
}

export function computeColorIdOptions(options?: ColorIdOptions) {
  const colorId = options?.colorId ?? uget(_currentColorId)
  return { ...computeProjectIdOptions(options), colorId }
}

export function computeShadeIdOptions(options?: ShadeIdOptions) {
  const shadeIndex = options?.shadeIndex ?? uget(_currentShadeIndex)
  return { ...computeColorIdOptions(options), shadeIndex }
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

      if (!projects.some((v) => v.name === newName)) {
        return newName
      }
    }
  } else {
    return name
  }
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

export function goColorId(by: number) {
  const project = findById(uget(_projects), get(_currentProjectId))

  if (project.colors.length < 0) {
    return
  }

  const currentColorId = uget(_currentColorId)
  const currentColorIndex = project.colors.findIndex(
    (v) => v.id === currentColorId
  )

  if (currentColorIndex < 0) {
    _currentColorId.set(project.colors[0].id)
    return
  }

  const nextIndex = mod(currentColorIndex + by, project.colors.length)
  _currentColorId.set(project.colors[nextIndex].id)
}
