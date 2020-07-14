<script>
  import { navigate } from 'svelte-navigator'
  import { createProject, importProject, projects } from '/@/store/project'
  import ProjectView from '/@/components/Dashboard/ProjectView.svelte'
  import InputFile from '/@/components/base/InputFile.svelte'

  let newProjectName
  let importFiles

  $: if (importFiles && importFiles[0]) {
    const reader = new FileReader()

    reader.onload = (e) => {
      const projectId = importProject(JSON.parse(e.target.result))
      navigate(`/project/${projectId}`)
    }

    reader.readAsText(importFiles[0])
  }

  function handleCreateProject() {
    if (!newProjectName) {
      // TODO: Show error to user
      return
    }

    const projectId = createProject(newProjectName)
    navigate(`/project/${projectId}`)
  }
</script>

<div class="container w-full h-full flex flex-col justify-center items-center">
  <div class="text-center my-10">
    <p class="text-lg opacity-80 mb-3">Ready to pick a palette?</p>
    <form novalidate on:submit|preventDefault={handleCreateProject}>
      <input
        bind:value={newProjectName}
        class="input"
        type="text"
        size="15"
        placeholder="Project name"
      />
      <button class="button" type="submit">Create</button>
    </form>
    {#if $projects.length <= 0}
      <p class="my-5 text-sm opacity-60">or</p>
      <InputFile bind:files={importFiles}>Import a project</InputFile>
    {/if}
  </div>
  {#if $projects.length > 0}
    <div class="w-full max-w-4xl">
      <ProjectView />
    </div>
  {/if}
</div>
