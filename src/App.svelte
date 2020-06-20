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

<style global>
  html {
    overflow: hidden;
  }
</style>

<svelte:window on:keydown={handleHistory} />

<main class="w-full h-screen overflow-x-hidden">
  {#if $state.projects[$state.selected] == null}
    <Dashboard />
  {:else}
    <Editor />
  {/if}
</main>
