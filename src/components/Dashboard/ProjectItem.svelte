<script>
  import type { Project } from '/@/utils/types'
  import { faTrashAlt, faUpload } from '@fortawesome/free-solid-svg-icons'
  import Icon from 'svelte-fa'
  import { navigate } from '@bjornlu/svelte-router'
  import { openedProjectIds } from '/@/store/opened'
  import {
    exportProject,
    projects,
    removeProject,
    renameProject
  } from '/@/store/projects'
  import ColorBox from '/@/components/base/ColorBox.svelte'
  import EditableText from '/@/components/base/EditableText.svelte'

  export let projectId: string

  $: project = $projects.find((v) => v.id === projectId)

  $: isOpened = $openedProjectIds.includes(projectId)

  let itemTitle: string
  $: itemTitle = isOpened
    ? `${project?.name} is already opened in another tab`
    : `Open ${project?.name}`

  function handleNameChange(e: Event) {
    renameProject((e.target as HTMLInputElement).value, { projectId })
  }

  function handleItemClick() {
    if (!isOpened) {
      navigate(`/project/${projectId}`)
    }
  }

  function handleExportClick() {
    exportProject({ projectId })
  }

  function handleTrashClick() {
    removeProject({ projectId })
  }
</script>

{#if project != null}
  <fieldset
    class="item"
    role="button"
    disabled={isOpened}
    title={itemTitle}
    on:click={handleItemClick}
  >
    <div class="flex justify-between items-center mb-3">
      <div class="flex-grow font-medium truncate" on:click|stopPropagation>
        <EditableText
          class="w-full bg-transparent"
          value={project.name}
          size={9}
          on:change={handleNameChange}
        />
      </div>
      <div class="flex-shrink">
        <button
          class="button button--small button--icon"
          title={`Export ${project.name}`}
          on:click|stopPropagation={handleExportClick}
        >
          <Icon icon={faUpload} />
        </button>
        <button
          class="button button--small button--icon"
          title={`Remove ${project.name}`}
          on:click|stopPropagation={handleTrashClick}
        >
          <Icon icon={faTrashAlt} />
        </button>
      </div>
    </div>
    <ul class="space-x-1">
      {#each project.colors as color (color.id)}
        <li class="inline-block">
          <ColorBox
            color={color.shades[Math.floor(color.shades.length / 2)]}
            small
          />
        </li>
      {/each}
    </ul>
  </fieldset>
{/if}

<style lang="postcss">
  .item {
    @apply inline-block w-full h-full px-3 py-2 rounded bg-white border border-gray-300 transition-colors duration-200;
  }

  .item:not(:disabled):hover,
  .item:not(:disabled):focus {
    @apply bg-primary-300 bg-opacity-20;
  }

  .item:disabled {
    @apply opacity-30;
  }
</style>
