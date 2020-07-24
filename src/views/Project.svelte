<script>
  import type { SetupFunction } from '/@/actions/shortcut'
  import { onDestroy, tick } from 'svelte'
  import { Route, navigate, useParams } from 'svelte-navigator'
  import { shortcut } from '/@/actions/shortcut'
  import { removeOpenedProject } from '/@/store/opened'
  import {
    currentProject,
    currentProjectId,
    currentColorId
  } from '/@/store/projects'
  import { projectRedo, projectUndo } from '/@/store/projects'
  import ColorPanel from '/@/components/Project/ColorPanel.svelte'
  import EditColor from './Project/EditColor.svelte'

  const params = useParams()

  // Manually set current project id store since svelte-navigator doesn't have
  // a global params store
  const paramsUnsubscribe = params.subscribe((params) => {
    $currentProjectId = params.projectId
  })

  onDestroy(() => {
    $currentProjectId = undefined
    paramsUnsubscribe()
  })

  if ($currentProject == null) {
    tick().then(() => navigate('/dashboard', { replace: true }))
  }

  const setupShortcuts: SetupFunction = (on) => {
    on('mod+z', () => projectUndo())
    on(['mod+y', 'mod+shift+z'], () => projectRedo())

    // mod+n opens color at index n-1
    for (let i = 1; i < 9; i++) {
      on(`mod+${i}`, () => ($currentColorId = $currentProject.colors[i - 1].id))
    }
  }
</script>

<svelte:window use:shortcut={setupShortcuts} />

{#if $currentProject != null}
  <div class="h-full flex flex-col">
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
          <EditColor />
        </div>
      </div>
    </div>
  </div>
{/if}
