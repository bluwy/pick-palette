<script>
  import { faFileImport } from '@fortawesome/free-solid-svg-icons'
  import Icon from 'svelte-fa'
  import { navigate } from 'svelte-navigator'
  import { importProject, projects } from '/@/store/project'
  import ProjectViewItem from './ProjectViewItem.svelte'
  import InputFile from '../base/InputFile.svelte'

  let importFiles: FileList = [] as any

  $: if (importFiles && importFiles[0]) {
    const reader = new FileReader()

    reader.onload = (e) => {
      const text = e.target.result as string
      const projectId = importProject(JSON.parse(text))
      navigate(`/project/${projectId}`)
    }

    reader.readAsText(importFiles[0])
  }
</script>

<div class="flex justify-between items-center mb-2">
  <div class="text-xl">My projects</div>
  <InputFile bind:files={importFiles}>
    <Icon icon={faFileImport} class="inline-block mr-1" />
    <span>Import project</span>
  </InputFile>
</div>

<ul class="flex flex-row flex-wrap -mx-2">
  {#each $projects as project (project.id)}
    <li class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
      <ProjectViewItem projectId={project.id} />
    </li>
  {/each}
</ul>
