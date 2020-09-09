import { get } from 'svelte/store'
import { initPathRouter } from '@bjornlu/svelte-router'
import Dashboard from './views/Dashboard.svelte'
import Project from './views/Project.svelte'
import { currentProject } from '/@/store/projects'

initPathRouter([
  {
    path: '/dashboard',
    component: Dashboard
  },
  {
    path: '/project/:projectId',
    component: Project,
    redirect: () => (get(currentProject) == null ? '/dashboard' : undefined)
  },
  {
    path: '/*',
    redirect: '/dashboard'
  }
])
