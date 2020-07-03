<script>
  import { state, undo, redo } from './store/state'
  import Dashboard from './views/Dashboard.svelte'
  import Editor from './views/Editor.svelte'

  const handleHistory = (e) => {
    if (e.ctrlKey && e.key === 'z') {
      undo()
    } else if (
      (e.ctrlKey && e.key == 'y') ||
      (e.ctrlKey && e.shiftKey && e.key === 'Z')
    ) {
      redo()
    }
  }
</script>

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
</style>

<svelte:window on:keydown={handleHistory} />

<main class="w-full h-screen overflow-hidden">
  {#if $state.projects[$state.selected] == null}
    <Dashboard />
  {:else}
    <Editor />
  {/if}
</main>
