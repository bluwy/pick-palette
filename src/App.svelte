<script>
  import { undo, redo } from './store'
  import TheHeader from './components/TheHeader.svelte'
  import ColorTab from './components/ColorTab.svelte'

  const colorTabs = [
    {
      label: 'Primary',
      colors: [
        '#faf5ff',
        '#e9d8fd',
        '#d6bcfa',
        '#b794f4',
        '#9f7aea',
        '#805ad5',
        '#6b46c1',
        '#553c9a',
        '#44337a'
      ]
    }
  ]

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

<main>
  <TheHeader />
  <div class="container">
    <ul>
      {#each colorTabs as tab}
        <li>
          <ColorTab {...tab} />
        </li>
      {/each}
    </ul>
  </div>
</main>
