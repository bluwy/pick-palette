<script lang="ts">
  import Icon from 'svelte-fa'
  import { Link } from '@bjornlu/svelte-router'
  import {
    faUpload,
    faHome,
    faUndo,
    faRedo,
    faPalette,
    faFill,
    faPlus
  } from '@fortawesome/free-solid-svg-icons'
  import { breakpointLg } from '@/store/media'
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
  } from '@/store/projects'
  import EditableText from '@/components/base/EditableText.svelte'
  import NewColor from './NewColor.svelte'
  import ToggleColorPanel from './ToggleColorPanel.svelte'

  function handleNameChange(e: Event) {
    renameProject((e.target as HTMLInputElement).value)
  }
</script>

<div class="flex flex-wrap items-center py-1">
  <div class="w-full sm:w-1/3 sm:order-2 text-xl text-center truncate">
    <EditableText
      class="w-full bg-transparent text-center"
      value={$currentProject?.name ?? ''}
      size={7}
      title="Rename project"
      buttonProps={{ title: 'Click to rename project' }}
      on:change={handleNameChange}
    />
  </div>
  <div class="w-1/2 sm:w-1/3 sm:order-1">
    <Link class="button button--icon" to="/dashboard" title="Go to dashboard">
      <Icon icon={faHome} />
    </Link>
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
  <div class="w-1/2 sm:w-1/3 sm:order-3 text-right">
    <NewColor let:show>
      <button
        class="button button--icon relative"
        class:button--icon--active={show}
        title="Add new color"
      >
        <Icon icon={faFill} />
        <Icon
          class="absolute bottom-0 right-0 p-sm m-sm"
          icon={faPlus}
          size="sm"
        />
      </button>
    </NewColor>
    <button
      class="button button--icon"
      title="Export project"
      on:click={() => exportProject()}
    >
      <Icon icon={faUpload} />
    </button>
    {#if !$breakpointLg}
      <ToggleColorPanel let:show>
        <button
          class="button button--icon lg:hidden"
          class:button--icon--active={show}
          title="{show ? 'Close' : 'Open'} color panel"
        >
          <Icon icon={faPalette} />
        </button>
      </ToggleColorPanel>
    {/if}
  </div>
</div>
