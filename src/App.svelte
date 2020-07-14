<script>
  import { Router, Route } from 'svelte-navigator'
  import Snackbar from './components/Snackbar.svelte'
  import Dashboard from './views/Dashboard.svelte'
  import Null from './views/Null.svelte'
  import Project from './views/Project.svelte'
</script>

<main class="w-full h-screen overflow-hidden">
  <Router primary={false}>
    <Route path="/dashboard">
      <Dashboard />
    </Route>
    <Route path="/project/:projectId/*">
      <Project />
    </Route>
    <Route path="/*">
      <Null />
    </Route>
  </Router>
  <Snackbar />
</main>
