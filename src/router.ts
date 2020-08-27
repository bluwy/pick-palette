import { initRouter } from '@bjornlu/svelte-router'
import Dashboard from './views/Dashboard.svelte'
import Project from './views/Project.svelte'

initRouter({
  mode: 'history',
  routes: [
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
  ]
})
