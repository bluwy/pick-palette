<script>
  import type { SetupFunction } from '/@/actions/shortcut'
  import { onDestroy, tick } from 'svelte'
  import { navigate, useParams } from 'svelte-navigator'
  import { shortcut } from '/@/actions/shortcut'
  import {
    currentProject,
    setCurrentColorId,
    setCurrentProjectId,
    projectRedo,
    projectUndo
  } from '/@/store/projects'
  import Header from '/@/components/Project/Header.svelte'
  import ColorPanel from '/@/components/Project/ColorPanel.svelte'
  import Editor from '/@/components/Project/Editor.svelte'
  import IdeaPanel from '/@/components/Project/IdeaPanel.svelte'

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
      on(`mod+${i}`, () => setCurrentColorId($currentProject.colors[i - 1].id))
    }
  }
</script>

<svelte:window use:shortcut={setupShortcuts} />

{#if $currentProject != null}
  <div class="flex flex-col h-full">
    <div class="flex-shrink">
      <Header />
    </div>
    <div class="flex-grow flex overflow-y-auto">
      <div class="flex-shrink">
        <ColorPanel />
      </div>
      <div class="flex-grow">
        <Editor />
      </div>
      <div class="flex-shrink">
        <IdeaPanel />
      </div>
    </div>
  </div>
{/if}
