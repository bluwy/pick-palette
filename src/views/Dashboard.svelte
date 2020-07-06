<script>
  import { nanoid } from 'nanoid/non-secure'
  import { state, updateState } from '@/store/state'

  let newProjectName = ''

  function createProject() {
    if (!newProjectName) {
      // TODO: Show error to user
      return
    }

    updateState((state) => {
      state.projects.push({
        id: nanoid(10),
        name: newProjectName,
        colors: []
      })
      state.selected = state.projects.length - 1
    }, true)
  }

  function selectProject(index) {
    updateState((state) => {
      state.selected = index
    }, true)
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
        {#each $state.projects as project, i (project.id)}
          <button
            class="w-full px-3 py-2 rounded bg-primary-500 bg-opacity-0
            hover:bg-opacity-20 focus:bg-opacity-20"
            on:click={selectProject(i)}
          >
            {project.name}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
