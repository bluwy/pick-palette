<script>
  export let color: string
  export let small = false
</script>

<div class="box" class:box--sm={small} style="background-color: {color};" />

<style lang="postcss">
  .box {
    @apply rounded-lg border border-gray-500 transition-colors duration-75;
    width: 1.5rem;
    height: 1.5rem;
  }

  @screen sm {
    .box {
      width: 1.75rem;
      height: 1.75rem;
    }
  }

  .box--sm {
    @apply w-6 h-6 rounded;
  }
</style>
