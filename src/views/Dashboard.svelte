<script>
  import { nanoid } from 'nanoid/non-secure'
  import { Navigate, navigateTo } from 'svelte-router-spa'
  import { state } from '@/store/state'

  let newProjectName = ''

  function createProject() {
    if (!newProjectName) {
      // TODO: Show error to user
      return
    }

    const projectId = nanoid(10)

    state.update('Create new project', (state) => {
      state.projects.push({
        id: projectId,
        name: newProjectName,
        colors: []
      })
    })

    navigateTo(`project/${projectId}`)
  }
</script>

<div class="container w-full h-full flex flex-col justify-center items-center">
  <div class="text-center">
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
  </div>
  {#if $state.projects.length > 0}
    <div class="text-center mt-10">
      <p class="opacity-80 mb-2">Or continue on previous projects:</p>
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
