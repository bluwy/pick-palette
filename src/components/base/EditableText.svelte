<script>
  import { tick } from 'svelte'

  export let value: string
  export let isEditing = false
  export let buttonProps = {}

  let input: HTMLInputElement

  function open() {
    isEditing = true
    tick().then(() => input.select())
  }

  function close() {
    isEditing = false
  }
</script>

{#if isEditing}
  <input
    type="text"
    bind:this={input}
    bind:value
    on:change
    on:change={close}
    on:blur={close}
    {...$$restProps}
  />
{:else}
  <button on:click={open} {...buttonProps}>{value}</button>
{/if}
