<script>
  import {
    faUpload,
    faHome,
    faUndo,
    faRedo
  } from '@fortawesome/free-solid-svg-icons'
  import Icon from 'svelte-fa'
  import { link } from 'svelte-navigator'
  import {
    currentProject,
    renameProject,
    exportProject,
    canUndo,
    canRedo,
    projectUndo,
    projectRedo,
    currentUndoName,
    currentRedoName
  } from '/@/store/projects'
  import EditableText from '/@/components/base/EditableText.svelte'
  import NewColor from './NewColor.svelte'

  function handleNameChange(e: Event) {
    renameProject((e.target as HTMLInputElement).value)
  }
</script>

<div class="flex items-center">
  <div class="flex-shrink w-1/3">
    <button
      class="button button--icon"
      disabled={!$canUndo}
      title={`Undo ${$currentUndoName}`}
      on:click={() => projectUndo()}
    >
      <Icon icon={faUndo} />
    </button>
    <button
      class="button button--icon"
      disabled={!$canRedo}
      title={`Redo ${$currentRedoName}`}
      on:click={() => projectRedo()}
    >
      <Icon icon={faRedo} />
    </button>
  </div>
  <div class="flex-grow text-xl text-center truncate">
    <EditableText
      class="w-full bg-transparent text-center"
      value={$currentProject.name}
      size={7}
      on:change={handleNameChange}
    />
  </div>
  <div class="flex-shrink w-1/3 text-right">
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
