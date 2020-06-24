<script>
  export let outline = false
  export let disabled = false
  export let small = false
  export let props = {}
</script>

<style lang="postcss">
  .base {
    @apply text-white bg-primary-500 border-2 border-primary-500 rounded px-3 py-1 transition-colors duration-200;
  }

  .base--small {
    @apply text-sm px-2;
    padding-top: 0.125rem;
    padding-bottom: 0.125rem;
  }

  .base:not(:disabled):hover,
  .base:not(:disabled):focus {
    @apply bg-opacity-80;
  }

  .base:disabled {
    @apply bg-gray-600 border-gray-600;
  }

  .base.outline {
    @apply text-primary-800 bg-opacity-0;
  }

  .base.outline:not(:disabled):hover,
  .base.outline:not(:disabled):focus {
    @apply bg-opacity-20;
  }

  .base.outline:disabled {
    @apply text-gray-800 bg-opacity-30;
  }
</style>

<button
  class="base"
  class:outline
  class:base--small={small}
  {disabled}
  {...props}
  on:click
>
  <slot />
</button>
