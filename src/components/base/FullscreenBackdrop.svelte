<script>
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'

  const dispatch = createEventDispatcher()
</script>

<div
  transition:fade={{ duration: 150 }}
  class="backdrop"
  on:click={() => dispatch('backdropclick')}
>
  <slot />
</div>

<style lang="postcss">
  .backdrop {
    @apply fixed flex justify-center items-center w-screen h-screen z-20;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: saturate(180%) blur(20px);
  }
</style>
