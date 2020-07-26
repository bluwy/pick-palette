<script>
  import { faUpload, faHome } from '@fortawesome/free-solid-svg-icons'
  import Icon from 'svelte-fa'
  import { link } from 'svelte-navigator'
  import {
    currentProject,
    renameProject,
    exportProject
  } from '/@/store/projects'
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
    <button class="button button--icon" on:click={() => exportProject()}>
      <Icon icon={faUpload} />
    </button>
    <a use:link class="button button--icon" href="/dashboard">
      <Icon icon={faHome} />
    </a>
  </div>
</div>
