import Dashboard from './views/Dashboard.svelte'
import Project from './views/Project.svelte'
import ProjectNewColor from './views/Project/NewColor.svelte'
import ProjectEditColor from './views/Project/EditColor.svelte'

export const routes = [
  {
    name: 'dashboard',
    component: Dashboard
  },
  {
    name: 'project/:projectid',
    component: Project,
    nestedRoutes: [
      {
        name: 'new',
        component: ProjectNewColor
      },
      {
        name: 'edit/:colorid/:shadeindex',
        component: ProjectEditColor
      }
    ]
  },
  {
    name: '404',
    redirectTo: '/dashboard'
  }
]
