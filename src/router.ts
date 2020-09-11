import { get } from 'svelte/store'
import { initPathRouter } from '@bjornlu/svelte-router'
import { currentProject } from '/@/store/projects'
import Dashboard from './views/Dashboard.svelte'
import Project from './views/Project.svelte'

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
