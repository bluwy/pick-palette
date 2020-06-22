<script>
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

<div class="opacity-70 mb-5">Palette</div>

<ul class="mb-4 space-y-4">
  {#each project.colors as color, index}
    <li>
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

<Button outline on:click={() => ($currentEditorView = editorViews.newColor)}>
  Add color
</Button>
