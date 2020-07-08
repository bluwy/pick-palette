<script>
  import { state } from './store/state'
  import { selectedProjectId } from './store/project'
  import Snackbar from './components/Snackbar.svelte'
  import Dashboard from './views/Dashboard.svelte'
  import Project from './views/Project.svelte'

  const handleHistory = (e) => {
    if (e.ctrlKey && e.key === 'z') {
      state.undo()
    } else if (
      (e.ctrlKey && e.key == 'y') ||
      (e.ctrlKey && e.shiftKey && e.key === 'Z')
    ) {
      state.redo()
    }
  }
</script>

<svelte:window on:keydown={handleHistory} />

<main class="w-full h-screen overflow-hidden">
  {#if $state.projects.find((v) => v.id === $selectedProjectId) == null}
    <Dashboard />
  {:else}
    <Project />
  {/if}
  <Snackbar />
</main>

<style global lang="postcss">
  html {
    overflow: hidden;
  }

  :disabled {
    cursor: not-allowed;
  }

  input,
  .input {
    @apply rounded px-3 py-1 border border-gray-500 bg-gray-500 bg-opacity-10 transition-all duration-200;
  }

  .input--small {
    @apply text-sm px-2 py-sm;
  }

  .input--transparent {
    @apply bg-gray-500 border-none bg-opacity-0;
  }

  input:not(:disabled):hover,
  .input:not(:disabled):hover,
  input:not(:disabled):focus,
  .input:not(:disabled):focus {
    @apply bg-primary-500 bg-opacity-20 border-primary-500;
  }

  input:disabled,
  .input:disabled,
  .input--disabled {
    @apply bg-opacity-50 opacity-50;
  }

  button,
  .button {
    @apply text-white bg-primary-500 border-2 border-primary-500 rounded px-3 py-1 transition-colors duration-200;
  }

  .button--small {
    @apply text-sm px-2 py-sm;
  }

  .button--transparent {
    @apply bg-transparent border-none;
  }

  button:not(:disabled):hover,
  .button:not(:disabled):hover,
  button:not(:disabled):focus,
  .button:not(:disabled):focus {
    @apply bg-opacity-80;
  }

  button:disabled,
  .button:disabled,
  .button--disabled {
    @apply bg-gray-600 border-gray-600;
  }

  .button--outline {
    @apply text-primary-800 bg-opacity-0;
  }

  .button--outline:not(:disabled):hover,
  .button--outline:not(:disabled):focus {
    @apply bg-opacity-20;
  }

  .button--outline:disabled {
    @apply text-gray-800 bg-opacity-30;
  }
</style>
