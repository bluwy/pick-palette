<script>
  import type { Project } from '/@/utils/types'
  import { faTrashAlt, faUpload } from '@fortawesome/free-solid-svg-icons'
  import Icon from 'svelte-fa'
  import { link } from 'svelte-navigator'
  import { openedProjectIds } from '/@/store/opened'
  import { exportProject, renameProject } from '/@/store/project'
  import { projects, removeProject } from '/@/store/projects'
  import ColorBox from '/@/components/base/ColorBox.svelte'
  import EditableText from '/@/components/base/EditableText.svelte'

  export let projectId: string

  let project: Project
  $: project = $projects.find((v) => v.id === projectId)

  let isOpened: boolean
  $: isOpened = $openedProjectIds.includes(projectId)

  function handleNameChange(e: Event) {
    renameProject((e.target as HTMLInputElement).value, projectId)
  }

  function handleExportClick() {
    exportProject(projectId)
  }

  function handleTrashClick() {
    removeProject(projectId)
  }
</script>

{#if project != null}
  <div
    class="inline-block w-full h-full px-3 py-2 rounded bg-white border
    border-gray-300"
    title={isOpened ? "Cannot open project. It's already opened in another tab." : ''}
  >
    <div class="flex justify-between items-center mb-3">
      <div class="flex-grow font-medium truncate">
        <EditableText
          class="w-full"
          value={project.name}
          on:change={handleNameChange}
        />
      </div>
      <div class="flex-shrink flex">
        {#if !isOpened}
          <a
            use:link
            class="button button--small button--outline mr-1 opacity-60
            hover:opacity-100"
            href={`project/${projectId}`}
            title={`Open "${project.name}"`}
          >
            Open
          </a>
        {/if}
        <button
          class="button button--small button--icon mr-1"
          on:click={handleExportClick}
        >
          <Icon icon={faUpload} />
        </button>
        <button
          class="button button--small button--icon"
          on:click={handleTrashClick}
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
  </div>
{/if}
