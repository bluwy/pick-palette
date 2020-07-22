<script>
  export let value: string
  export let isEditing = false
</script>

{#if isEditing}
  <input
    type="text"
    bind:value
    on:change
    on:change={() => {
      isEditing = false
    }}
    on:blur={() => {
      isEditing = false
    }}
    {...$$restProps}
  />
{:else}
  <span on:click={() => (isEditing = true)}>{value}</span>
{/if}
