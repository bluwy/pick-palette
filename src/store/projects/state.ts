import { assert, array } from 'superstruct'
import { writable } from 'svelte/store'
import { synchronize } from '/@/store/base/synchronize'
import { recordHistory } from '/@/store/base/record-history'
import { Project } from '/@/utils/types'
import { ProjectStruct } from '/@/utils/validation-structs'

const projectsStore = writable([] as Project[])

export const _projects = {
  ...projectsStore,
  synchronize: synchronize(projectsStore, 'pp:projects'),
  history: recordHistory(projectsStore, { limit: 50 })
}

// Run state validation in development
if (process.env.NODE_ENV !== 'production') {
  _projects.subscribe((state) => {
    assert(state, array(ProjectStruct))
  })
}
