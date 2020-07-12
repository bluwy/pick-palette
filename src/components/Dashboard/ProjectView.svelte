<script>
  import { faFileImport } from '@fortawesome/free-solid-svg-icons'
  import Icon from 'svelte-fa'
  import { navigate } from 'svelte-navigator'
  import { state } from '/@/store/state'
  import InputProjectImport from '/@/components/InputProjectImport.svelte'
  import ProjectViewItem from './ProjectViewItem.svelte'
</script>

<div class="flex justify-between items-center mb-2">
  <div class="text-xl">My projects</div>
  <InputProjectImport on:import={(e) => navigate(`/project/${e.detail}`)}>
    <Icon icon={faFileImport} class="inline-block mr-1" />
    <span>Import project</span>
  </InputProjectImport>
</div>

<ul class="flex flex-row flex-wrap -mx-2">
  {#each $state.projects as project (project.id)}
    <li class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
      <ProjectViewItem projectId={project.id} />
    </li>
  {/each}
</ul>
