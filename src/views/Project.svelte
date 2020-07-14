<script>
  import { onDestroy, onMount, tick } from 'svelte'
  import { Route, navigate, useParams } from 'svelte-navigator'
  import { shortcut } from '/@/actions/shortcut'
  import {
    addOpenedProject,
    currentProject,
    currentProjectId,
    projectRedo,
    projectUndo,
    removeOpenedProject
  } from '/@/store/project'
  import ColorPanel from '/@/components/Project/ColorPanel.svelte'
  import Header from '/@/components/Project/Header.svelte'
  import NewColor from './Project/NewColor.svelte'
  import EditColor from './Project/EditColor.svelte'

  const params = useParams()

  // TODO: Use different router that provides a global active route store
  const paramsUnsubscribe = params.subscribe((params) => {
    const prevProjectId = $currentProjectId
    const newProjectId = params.projectId

    if (newProjectId !== prevProjectId) {
      // When switching projects, we remove the previous one from openedProjects
      if (prevProjectId != null) {
        removeOpenedProject(prevProjectId)
      }

      addOpenedProject(newProjectId)
      $currentProjectId = newProjectId
    }
  })

  onDestroy(() => {
    removeOpenedProject($currentProjectId)
    paramsUnsubscribe()
  })

  if ($currentProject == null) {
    tick().then(() => navigate('/dashboard', { replace: true }))
  }

  function handleBeforeUnload() {
    // When user leaves page, remove from openedProjects
    removeOpenedProject($currentProjectId)
  }

  function setupShortcuts(on) {
    on('mod+z', () => projectUndo())
    on(['mod+y', 'mod+shift+z'], () => projectRedo())

    // mod+n opens color at index n-1
    for (let i = 1; i < 9; i++) {
      on(`mod+${i}`, () => {
        try {
          const colorId = $currentProject.colors[i - 1].id
          navigate(`/project/${$currentProjectId}/edit/${colorId}/-1`)
        } catch {}
      })
    }
  }
</script>

<svelte:window
  use:shortcut={setupShortcuts}
  on:beforeunload={handleBeforeUnload}
/>

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
          <NewColor />
        </Route>
        <Route path="/edit/:colorId/:shadeIndex">
          <EditColor />
        </Route>
      </div>
    </div>
  </div>
</div>
