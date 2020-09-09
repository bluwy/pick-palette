import { initPathRouter } from '@bjornlu/svelte-router'
import Dashboard from './views/Dashboard.svelte'
import Project from './views/Project.svelte'

initPathRouter([
  {
    path: '/dashboard',
    component: Dashboard
  },
  {
    path: '/project/:projectId',
    component: Project
  },
  {
    path: '/*',
    redirect: '/dashboard'
  }
])
