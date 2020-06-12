<script>
  import ColorButton from './ColorButton.svelte'

  export let name
  export let colors
</script>

<div>
  <div class="mb-2">{name}</div>
  <ol class="space-x-2">
    {#each colors as color}
      <li class="inline-block">
        <ColorButton {color} on:click={console.log(color)} />
      </li>
    {/each}
  </ol>
</div>
