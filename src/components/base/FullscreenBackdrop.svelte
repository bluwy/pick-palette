<script lang="ts">
  import { fade } from 'svelte/transition'
</script>

<div transition:fade={{ duration: 150 }} class="backdrop" on:click>
  <slot />
</div>

<style lang="postcss">
  .backdrop {
    @apply fixed top-0 left-0 flex justify-center items-center w-screen h-screen z-20;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: saturate(180%) blur(20px);
  }
</style>
