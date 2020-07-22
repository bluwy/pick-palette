import { Project } from '/@/utils/types'

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
