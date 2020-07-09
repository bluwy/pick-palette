<script>
  import { faFileImport } from '@fortawesome/free-solid-svg-icons'
  import { nanoid } from 'nanoid/non-secure'
  import { coerce, StructError } from 'superstruct'
  import Icon from 'svelte-fa'
  import { Navigate, navigateTo } from 'svelte-router-spa'
  import { openedProjects } from '@/store/project'
  import { addSnack } from '@/store/snackbar'
  import { state } from '@/store/state'
  import { Project } from '@/utils/validation-structs'

  let newProjectName = ''
  let importFiles

  $: if (importFiles && importFiles[0]) {
    const reader = new FileReader()
    reader.onload = (e) => importProject(JSON.parse(e.target.result))
    reader.readAsText(importFiles[0])
  }

  function createProject() {
    if (!newProjectName) {
      // TODO: Show error to user
      return
    }

    const projectId = nanoid(6)

    state.update('Create new project', (state) => {
      state.projects.push({
        id: projectId,
        name: newProjectName,
        colors: []
      })
    })

    openProject(projectId)
  }

  function importProject(data) {
    try {
      const projectData = coerce(data, Project)

      // Make sure there's no duplicate id, if the user supplied one
      if ($state.projects.some((v) => v.id === projectData.id)) {
        projectData.id = nanoid(6)
      }

      state.update('Import project', (state) => {
        state.projects.push(projectData)
      })

      openProject(projectData.id)
    } catch (e) {
      // Ahh error. Show snackbar.
      // TODO: Better error display
      addSnack({ type: 'error', message: e.message })
    }
  }

  // TODO: Move this logic to nav event (Require router support)
  function openProject(id) {
    state.clear()
    openedProjects.add(id)
    navigateTo(`project/${id}`)
  }
</script>

<div class="container w-full h-full flex flex-col justify-center items-center">
  <div class="text-center my-10">
    <p class="text-lg opacity-80 mb-3">Ready to pick a palette?</p>
    <form novalidate on:submit|preventDefault={createProject}>
      <input
        bind:value={newProjectName}
        type="text"
        size="15"
        placeholder="Project name"
      />
      <button type="submit">Create</button>
    </form>
    {#if $state.projects.length <= 0}
      <p class="my-5 text-sm opacity-60">or</p>
      <label class="relative inline-block">
        <button class="button--outline">
          <span>Import a project</span>
        </button>
        <input
          class="absolute top-0 left-0 w-full h-full opacity-0"
          type="file"
          bind:files={importFiles}
        />
      </label>
    {/if}
  </div>
  {#if $state.projects.length > 0}
    <div class="w-full max-w-4xl">
      <div class="flex justify-between items-center">
        <div class="text-xl">My projects</div>
        <label class="relative">
          <button>
            <Icon icon={faFileImport} class="inline-block mr-1" />
            <span>Import project</span>
          </button>
          <input
            class="absolute top-0 left-0 w-full h-full opacity-0"
            type="file"
            bind:files={importFiles}
          />
        </label>
      </div>
      <div>
        {#each $state.projects as project (project.id)}
          <Navigate
            styles="inline-block w-full px-3 py-2 rounded bg-primary-200
            bg-opacity-0 text-primary-700 hover:bg-opacity-10
            focus:bg-opacity-10"
            to="project/{project.id}"
          >
            {project.name}
          </Navigate>
        {/each}
      </div>
    </div>
  {/if}
</div>
