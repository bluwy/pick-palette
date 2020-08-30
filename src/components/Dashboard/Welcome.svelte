<script>
  import { faDownload } from '@fortawesome/free-solid-svg-icons'
  import { tick } from 'svelte'
  import Icon from 'svelte-fa'
  import { navigate } from '@bjornlu/svelte-router'
  import { createProject } from '/@/store/projects'
  import InputFile from '/@/components/base/InputFile.svelte'
  import ImportProject from '/@/components/ImportProject.svelte'
  import Logo from '/@/components/Logo.svelte'
  import WelcomeDivider from '/@/assets/images/welcome/divider.svg'
  import WelcomeHero from '/@/assets/images/welcome/hero.svg'

  let newProjectName = ''
  let showImportProject = false

  function handleCreateProject() {
    if (!newProjectName) {
      // TODO: Show error to user
      return
    }

    const projectId = createProject(newProjectName)
    tick().then(() => navigate(`/project/${projectId}`))
  }
</script>

<ImportProject bind:show={showImportProject} />

<div class="container flex w-full h-full">
  <div
    class="hidden flex-grow md:flex justify-center items-center relative
    bg-primary-200"
  >
    <img class="hero" src={WelcomeHero} alt="Welcome hero" aria-hidden="true" />
    <div class="left-botch" />
  </div>
  <div class="hidden md:block flex-shrink">
    <img
      class="h-screen"
      src={WelcomeDivider}
      alt="Welcome divider"
      aria-hidden="true"
    />
  </div>
  <div
    class="flex-grow md:flex-shrink flex flex-col justify-center items-center
    text-center md:px-6 py-12"
  >
    <Logo />
    <form
      class="flex py-6"
      novalidate
      on:submit|preventDefault={handleCreateProject}
    >
      <input
        bind:value={newProjectName}
        class="input mr-3"
        type="text"
        size={15}
        placeholder="Project name"
      />
      <button class="button" type="submit">Create</button>
    </form>
    <button
      class="mt-2 opacity-80 hover:opacity-100 focus:opacity-100
      transition-opacity duration-200"
      on:click={() => (showImportProject = !showImportProject)}
    >
      <Icon class="opacity-40 mr-2" icon={faDownload} />
      Import a project
    </button>
  </div>
</div>

<style lang="postcss">
  .hero {
    height: 70vh;
  }

  .left-botch {
    @apply bg-primary-200;
    position: absolute;
    top: 0;
    right: 100%;
    width: 810px;
    height: 100%;
  }
</style>
