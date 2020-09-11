import { writable } from 'svelte/store'
import { synchronize } from '/@/store/base/synchronize'

const openedProjectIdsStore = writable<string[]>([])

export const _openedProjectIds = {
  ...openedProjectIdsStore,
  synchronize: synchronize(openedProjectIdsStore, 'pp:opened')
}
