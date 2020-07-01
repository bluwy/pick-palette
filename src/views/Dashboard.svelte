<script>
  import { state, dispatch } from '@/store/state'
  import InputText from '@/components/base/InputText.svelte'
  import Button from '@/components/base/Button.svelte'

  let newProjectName = ''

  $: projects = $state.projects || []

  const createProject = () => {
    if (!newProjectName) {
      // TODO: Show error to user
      return
    }

    dispatch((state) => {
      state.projects.push({ name: newProjectName })
      state.selected = state.projects.length - 1
    }, true)
  }

  const selectProject = (index) => {
    dispatch((state) => {
      state.selected = index
    }, true)
  }
</script>

<div class="container w-full h-full flex flex-col justify-center items-center">
  <div class="text-center">
    <p class="text-lg opacity-80 mb-3">Ready to pick a palette?</p>
    <form novalidate on:submit|preventDefault={createProject}>
      <InputText
        bind:value={newProjectName}
        props={{ size: 15, placeholder: 'Project name' }}
      />
      <Button props={{ type: 'submit' }}>Create</Button>
    </form>
  </div>
  {#if projects.length > 0}
    <div class="text-center mt-10">
      <p class="opacity-80 mb-2">Or continue on previous projects:</p>
      <div>
        {#each projects as project, i}
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
