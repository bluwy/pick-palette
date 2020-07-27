<script>
  import {
    faUpload,
    faHome,
    faUndo,
    faRedo,
    faPalette,
    faFill,
    faPlus
  } from '@fortawesome/free-solid-svg-icons'
  import Icon from 'svelte-fa'
  import { link } from 'svelte-navigator'
  import { breakpointLg } from '/@/store/breakpoint'
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
  import ToggleColorPanel from './ToggleColorPanel.svelte'

  function handleNameChange(e: Event) {
    renameProject((e.target as HTMLInputElement).value)
  }
</script>

<div class="flex flex-wrap items-center py-1">
  <div class="w-full lg:w-1/3 lg:order-2 text-xl text-center truncate">
    <EditableText
      class="w-full bg-transparent text-center"
      value={$currentProject.name}
      size={7}
      on:change={handleNameChange}
    />
  </div>
  <div class="w-1/2 lg:w-1/3 lg:order-1">
    <a use:link class="button button--icon" href="/dashboard">
      <Icon icon={faHome} />
    </a>
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
  <div class="w-1/2 lg:w-1/3 lg:order-3 text-right">
    <NewColor let:show>
      <button
        class="button button--icon relative"
        class:button--icon--active={show}
      >
        <Icon icon={faFill} />
        <Icon
          class="absolute bottom-0 right-0 p-sm m-sm"
          icon={faPlus}
          size="sm"
        />
      </button>
    </NewColor>
    <button class="button button--icon" on:click={() => exportProject()}>
      <Icon icon={faUpload} />
    </button>
    {#if !$breakpointLg}
      <ToggleColorPanel let:show>
        <button
          class="button button--icon lg:hidden"
          class:button--icon--active={show}
        >
          <Icon icon={faPalette} />
        </button>
      </ToggleColorPanel>
    {/if}
  </div>
</div>
