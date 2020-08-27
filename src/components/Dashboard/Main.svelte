<script>
  import type { SetupFunction } from '/@/actions/shortcut'
  import type { Project } from '/@/utils/types'
  import { faDownload, faPlus } from '@fortawesome/free-solid-svg-icons'
  import { tick } from 'svelte'
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'
  import Icon from 'svelte-fa'
  import { navigate } from '@bjornlu/svelte-router'
  import { shortcut } from '/@/actions/shortcut'
  import {
    createProject,
    projectRedo,
    projectUndo,
    projects
  } from '/@/store/projects'
  import { debounce } from '/@/utils/common'
  import ProjectItem from '/@/components/Dashboard/ProjectItem.svelte'
  import ImportProject from '/@/components/ImportProject.svelte'

  let search = ''
  let showImportProject = false

  let showProjects: Project[]
  $: {
    const lowerSearch = search.toLowerCase()
    showProjects = search
      ? $projects.filter((v) => v.name.toLowerCase().includes(lowerSearch))
      : $projects
  }

  const handleSearchInput = debounce((e: Event) => {
    search = (e.target as HTMLInputElement).value
  }, 200)

  function handleCreateProject() {
    const projectId = createProject()
    // Without tick, the url path change but page becomes half-transitioned.
    // Not sure why it happened here, but tick works.
    tick().then(() => navigate(`/project/${projectId}`))
  }

  const setupShortcuts: SetupFunction = (on) => {
    on('mod+z', () => projectUndo())
    on(['mod+y', 'mod+shift+z'], () => projectRedo())
  }
</script>

<svelte:window use:shortcut={setupShortcuts} />

<ImportProject bind:show={showImportProject} />

<div class="container py-3 sm:py-6 md:py-12 w-full h-full">
  <div class="flex flex-col h-full">
    <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
      <div class="text-xl text-center sm:text-left">My Projects</div>
      <div class="flex my-3 sm:my-0">
        <input
          class="input flex-grow"
          type="search"
          placeholder="Search projects..."
          size={12}
          value={search}
          on:input={handleSearchInput}
        />
        <button
          class="button button--icon ml-1"
          title="Create new project"
          on:click={handleCreateProject}
        >
          <Icon icon={faPlus} />
        </button>
        <button
          class="button button--icon ml-1"
          title="Import project"
          on:click={() => (showImportProject = !showImportProject)}
        >
          <Icon icon={faDownload} />
        </button>
      </div>
    </div>
    <ul class="flex flex-row flex-wrap -mx-2 overflow-y-auto">
      {#each showProjects as project (project.id)}
        <li
          animate:flip={{ duration: 250, delay: 100 }}
          in:fade={{ duration: 200, delay: 200 }}
          out:fade={{ duration: 200 }}
          class="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-2"
        >
          <ProjectItem projectId={project.id} />
        </li>
      {/each}
    </ul>
  </div>
</div>
