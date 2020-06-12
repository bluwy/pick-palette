<script>
  import { state, undo, redo } from './store'
  import Dashboard from './views/Dashboard.svelte'
  import TheHeader from './components/TheHeader.svelte'
  import ColorTab from './components/ColorTab.svelte'

  $: currentProject = $state.projects[$state.currentProject]
  $: showDashboard = currentProject == null

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

<svelte:window on:keydown={handleHistory} />

<main class="w-full h-screen overflow-x-hidden">
  {#if showDashboard}
    <Dashboard />
  {:else}
    <TheHeader />
    <div class="container">
      <ul>
        {#each currentProject.colors as color}
          <li>
            <ColorTab {...color} />
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</main>
