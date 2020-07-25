<script>
  import { currentProject, renameProject } from '/@/store/projects'
  import EditableText from '/@/components/base/EditableText.svelte'
  import NewColor from './NewColor.svelte'

  let showNewColorDialog = false

  function handleNameChange(e: Event) {
    renameProject((e.target as HTMLInputElement).value)
  }
</script>

<div
  class="flex justify-between items-center px-3 py-2 border-b border-gray-500"
>
  <div class="flex-grow text-xl truncate">
    <EditableText
      class="w-full"
      value={$currentProject.name}
      size={7}
      on:change={handleNameChange}
    />
  </div>
  <div class="flex-shrink">
    <NewColor bind:show={showNewColorDialog}>
      <button
        class="button button--outline button--small"
        on:click={() => (showNewColorDialog = !showNewColorDialog)}
      >
        Add color
      </button>
    </NewColor>
  </div>
</div>
