<script>
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'
  import { currentEditorView, editorViews } from '@/store/editor'
  import { dispatch, state } from '@/store/state'
  import Button from './base/Button.svelte'
  import ColorTab from './ColorTab.svelte'

  $: project = $state.projects[$state.selected]

  const removeColor = (index) => {
    dispatch((state) => {
      state.projects[state.selected].colors.splice(index, 1)
    })
  }

  const handleClickShade = () => {
    // TODO: Open edit view with shade context
    // Open color edit view
    $currentEditorView = editorViews.editColor
  }
</script>

<div class="flex flex-row justify-between items-center mb-5">
  <div class="opacity-70">Palette</div>
  <Button outline on:click={() => ($currentEditorView = editorViews.newColor)}>
    Add color
  </Button>
</div>

<ul class="mb-4 space-y-4">
  {#each project.colors as color, index (color.name)}
    <li
      transition:fade={{ duration: 200 }}
      animate:flip={{ duration: 300, delay: 100 }}
    >
      <ColorTab
        {...color}
        on:remove={() => removeColor(index)}
        on:clickshade={handleClickShade}
      />
    </li>
  {:else}
    <li class="text-center">
      <p class="text-sm opacity-50 my-6">No colors yet</p>
    </li>
  {/each}
</ul>
