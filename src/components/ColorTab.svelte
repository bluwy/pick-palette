<script>
  import ColorButton from './ColorButton.svelte'

  export let name
  export let shades
</script>

<div>
  <div class="opacity-80 mb-2">{name}</div>
  <ol class="space-x-2">
    {#each shades as color}
      <li class="inline-block">
        <ColorButton {color} on:click={console.log(color)} />
      </li>
    {/each}
  </ol>
</div>
