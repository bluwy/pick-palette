<script>
  export let value
  export let disabled = false
  export let props = {}
</script>

<style lang="postcss">
  .base {
    @apply rounded px-3 py-1 border border-gray-500 bg-gray-500 bg-opacity-10 transition-all duration-200;
  }

  .base:not(:disabled):hover,
  .base:not(:disabled):focus {
    @apply bg-primary-500 bg-opacity-20 border-primary-500 bg-primary-500 bg-opacity-20 border-primary-500;
  }

  .base:disabled {
    @apply bg-opacity-50 opacity-50;
  }
</style>

<input class="base" bind:value {disabled} {...props} on:change />
