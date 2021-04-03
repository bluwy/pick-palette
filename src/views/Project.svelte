<script lang="ts">
  import { shortcut } from '@/actions/shortcut'
  import { breakpointLg } from '@/store/media'
  import {
    currentProject,
    setCurrentColorId,
    projectRedo,
    projectUndo
  } from '@/store/projects'
  import ColorPanel from '@/components/Project/ColorPanel.svelte'
  import Editor from '@/components/Project/Editor.svelte'
  import Header from '@/components/Project/Header.svelte'
  import type { SetupFunction } from '@/actions/shortcut'

  const setupShortcuts: SetupFunction = (on) => {
    on('mod+z', () => projectUndo())
    on(['mod+y', 'mod+shift+z'], () => projectRedo())

    // mod+n opens color at index n-1
    for (let i = 1; i < 9; i++) {
      on(`mod+${i}`, () => {
        const color = $currentProject?.colors[i - 1]

        if (color != null) {
          setCurrentColorId(color.id)
        }
      })
    }
  }
</script>

<svelte:window use:shortcut={setupShortcuts} />

<div class="flex justify-center h-full px-1 py-3 lg:py-6">
  {#if $breakpointLg}
    <ColorPanel />
  {/if}
  <div class="flex flex-col w-full h-full max-w-lg lg:max-w-xl lg:pl-6">
    <div class="flex-shrink">
      <Header />
    </div>
    <div class="flex-grow h-full overflow-y-auto">
      <Editor />
    </div>
  </div>
</div>
