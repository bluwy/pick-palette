<script>
  import { nanoid } from 'nanoid/non-secure'
  import { navigateTo } from 'svelte-router-spa'
  import { state } from '@/store/state'
  import ProjectView from '@/components/Dashboard/ProjectView.svelte'
  import InputProjectImport from '@/components/InputProjectImport.svelte'

  let newProjectName = ''

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

  // TODO: Move this logic to nav event (Require router support)
  function openProject(id) {
    state.clear()
    navigateTo(`project/${id}`)
  }

  function handleProjectImport(e) {
    const projectId = e.detail
    openProject(projectId)
  }
</script>

<div class="container w-full h-full flex flex-col justify-center items-center">
  <div class="text-center my-10">
    <p class="text-lg opacity-80 mb-3">Ready to pick a palette?</p>
    <form novalidate on:submit|preventDefault={createProject}>
      <input
        bind:value={newProjectName}
        class="input"
        type="text"
        size="15"
        placeholder="Project name"
      />
      <button class="button" type="submit">Create</button>
    </form>
    {#if $state.projects.length <= 0}
      <p class="my-5 text-sm opacity-60">or</p>
      <InputProjectImport on:import={handleProjectImport}>
        Import a project
      </InputProjectImport>
    {/if}
  </div>
  {#if $state.projects.length > 0}
    <div class="w-full max-w-4xl">
      <ProjectView />
    </div>
  {/if}
</div>
