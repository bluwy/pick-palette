<script>
  import { onDestroy, onMount, tick } from 'svelte'
  import { Route, navigate, useParams } from 'svelte-navigator'
  import { openedProjects } from '@/store/project'
  import { state } from '@/store/state'
  import ColorPanel from '@/components/Project/ColorPanel.svelte'
  import Header from '@/components/Project/Header.svelte'
  import NewColor from './Project/NewColor.svelte'
  import EditColor from './Project/EditColor.svelte'

  const params = useParams()

  let projectId

  // Watch for projectId changes
  const paramsUnsubscribe = params.subscribe((params) => {
    const prevProjectId = projectId
    const newProjectId = params.projectId

    if (newProjectId !== prevProjectId) {
      // When switching projects, we remove the previous one from openedProjects
      if (prevProjectId != null) {
        openedProjects.remove(prevProjectId)
      }

      openedProjects.add(newProjectId)
      projectId = newProjectId

      // Also clear history when switching project
      state.clear()
    }
  })

  onDestroy(() => {
    state.clear()
    paramsUnsubscribe()
  })

  if ($state.projects.find((v) => v.id === projectId) == null) {
    tick().then(() => navigate('/dashboard', { replace: true }))
  }

  function handleBeforeUnload() {
    // When user leaves page, remove from openedProjects
    openedProjects.remove(projectId)
  }
</script>

<svelte:window on:beforeunload={handleBeforeUnload} />

<div class="h-full flex flex-col">
  <Header />
  <div class="container flex-grow overflow-y-auto">
    <div class="h-full py-6 flex flex-col md:flex-row">
      <div class="w-full h-full md:w-1/3 pb-3 md:pb-0 md:pr-6">
        <ColorPanel />
      </div>
      <div
        class="flex flex-col w-full h-full md:w-2/3 pt-3 md:pt-0 md:pl-6
        border-t border-gray-500 border-opacity-50 md:border-t-0 border-l"
      >
        <div class="opacity-70 mb-5">Editor</div>
        <Route path="/new">
          <NewColor {projectId} />
        </Route>
        <Route path="/edit/:colorId/:shadeIndex">
          <EditColor {projectId} />
        </Route>
      </div>
    </div>
  </div>
</div>
