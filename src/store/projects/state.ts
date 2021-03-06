import { route } from '@bjornlu/svelte-router'
import { writable, derived } from 'svelte/store'
import { synchronize } from '@/store/base/synchronize'
import { recordHistory } from '@/store/base/record-history'
import type { Project, WritableId } from '@/utils/types'

const projectsStore = writable<Project[]>([])

export const _projects = {
  ...projectsStore,
  synchronize: synchronize(projectsStore, 'pp:projects'),
  history: recordHistory(projectsStore, { limit: 50 })
}

export const _currentProjectId = derived(
  route,
  ($route) => $route.params.projectId as string | undefined
)

export const _currentColorId: WritableId = writable(undefined)

export const _currentShadeIndex = writable(-1)
