<script>
  import type { SetupFunction } from '/@/actions/shortcut'
  import { onDestroy, tick } from 'svelte'
  import { fly } from 'svelte/transition'
  import { navigate, useParams } from 'svelte-navigator'
  import { shortcut } from '/@/actions/shortcut'
  import { showColorPanel, setShowColorPanel } from '/@/store/app'
  import { breakpointLg } from '/@/store/breakpoint'
  import {
    currentProject,
    setCurrentColorId,
    setCurrentProjectId,
    projectRedo,
    projectUndo
  } from '/@/store/projects'
  import ColorPanel from '/@/components/Project/ColorPanel.svelte'
  import Editor from '/@/components/Project/Editor.svelte'
  import Header from '/@/components/Project/Header.svelte'

  const params = useParams()

  // Update currentProjectId based on route param
  const unsubscribeParams = params.subscribe((params) => {
    setCurrentProjectId(params.projectId)
  })

  onDestroy(() => {
    unsubscribeParams()
    setCurrentProjectId(undefined)
  })

  if ($currentProject == null) {
    tick().then(() => navigate('/dashboard', { replace: true }))
  }

  const setupShortcuts: SetupFunction = (on) => {
    on('mod+z', () => projectUndo())
    on(['mod+y', 'mod+shift+z'], () => projectRedo())

    // mod+n opens color at index n-1
    for (let i = 1; i < 9; i++) {
      on(`mod+${i}`, () => {
        const color = $currentProject.colors[i - 1]

        if (color != null) {
          setCurrentColorId(color.id)
        }
      })
    }
  }
</script>

<svelte:window use:shortcut={setupShortcuts} />

{#if $currentProject != null}
  <div class="flex justify-center h-full py-6 overflow-y-auto">
    {#if $breakpointLg || $showColorPanel}
      <div
        transition:fly={{ duration: 200, x: -10 }}
        class="fixed top-0 left-0 max-w-full p-2 z-10 lg:static lg:w-auto lg:p-0"
      >
        <ColorPanel />
      </div>
    {/if}
    <div class="flex flex-col w-full h-full max-w-xl lg:pl-6">
      <div class="flex-shrink">
        <Header />
      </div>
      <div class="flex-grow">
        <Editor />
      </div>
    </div>
  </div>
{/if}
