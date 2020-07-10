<script>
  import { faFileImport } from '@fortawesome/free-solid-svg-icons'
  import Icon from 'svelte-fa'
  import { Navigate, navigateTo } from 'svelte-router-spa'
  import { state } from '@/store/state'
  import InputProjectImport from '@/components/InputProjectImport.svelte'

  function handleProjectImport(e) {
    const projectId = e.detail
    state.clear()
    navigateTo(`project/${projectId}`)
  }
</script>

<div class="flex justify-between items-center">
  <div class="text-xl">My projects</div>
  <InputProjectImport on:import={handleProjectImport}>
    <Icon icon={faFileImport} class="inline-block mr-1" />
    <span>Import project</span>
  </InputProjectImport>
</div>

<div>
  {#each $state.projects as project (project.id)}
    <Navigate
      styles="inline-block w-full px-3 py-2 rounded bg-primary-200 bg-opacity-0
      text-primary-700 hover:bg-opacity-10 focus:bg-opacity-10"
      to="project/{project.id}"
    >
      {project.name}
    </Navigate>
  {/each}
</div>
