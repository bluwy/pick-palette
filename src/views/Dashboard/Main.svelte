<script>
  import type { Project } from '/@/utils/types'
  import { faDownload, faPlus } from '@fortawesome/free-solid-svg-icons'
  import { tick } from 'svelte'
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'
  import Icon from 'svelte-fa'
  import { navigate } from 'svelte-navigator'
  import { createProject, projects } from '/@/store/projects'
  import { debounce } from '/@/utils/common'
  import ProjectViewItem from '/@/components/Dashboard/ProjectViewItem.svelte'
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
</script>

<ImportProject bind:show={showImportProject} />

<div class="container py-12 w-full h-full">
  <div class="flex flex-col">
    <div class="flex flex-col sm:flex-row justify-between">
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
          on:click={() => (showImportProject = true)}
        >
          <Icon icon={faDownload} />
        </button>
      </div>
    </div>
    <ul class="flex flex-row flex-wrap -mx-2">
      {#each showProjects as project (project.id)}
        <li
          animate:flip={{ duration: 250, delay: 100 }}
          in:fade={{ duration: 200, delay: 200 }}
          out:fade={{ duration: 200 }}
          class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
        >
          <ProjectViewItem projectId={project.id} />
        </li>
      {/each}
    </ul>
  </div>
</div>
