<script>
  import { currentProject, renameProject } from '/@/store/projects'
  import EditableText from '/@/components/base/EditableText.svelte'
  import NewColor from './NewColor.svelte'

  function handleNameChange(e: Event) {
    renameProject((e.target as HTMLInputElement).value)
  }
</script>

<div class="flex justify-between items-center">
  <div class="flex-grow text-xl truncate">
    <EditableText
      class="w-full"
      value={$currentProject.name}
      size={7}
      on:change={handleNameChange}
    />
  </div>
  <div class="flex-shrink">
    <NewColor>
      <button class="button button--outline button--small">Add color</button>
    </NewColor>
  </div>
</div>
