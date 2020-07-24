import { writable } from 'svelte/store'
import { synchronize } from '/@/store/base/synchronize'
import { recordHistory } from '/@/store/base/record-history'
import { Project, WritableId } from '/@/utils/types'

const projectsStore = writable([] as Project[])

export const _projects = {
  ...projectsStore,
  synchronize: synchronize(projectsStore, 'pp:projects'),
  history: recordHistory(projectsStore, { limit: 50 })
}

export const _currentProjectId: WritableId = writable(undefined)

export const _currentColorId: WritableId = writable(undefined)

export const _currentShadeIndex = writable(-1)
