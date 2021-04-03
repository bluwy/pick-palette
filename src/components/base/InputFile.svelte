<script lang="ts">
  export let files: FileList
  export let multiple = false
</script>

<label class="relative inline-block">
  <button class="button">
    <slot />
  </button>
  <input
    class="absolute top-0 left-0 w-full h-full opacity-0"
    type="file"
    bind:files
    {multiple}
  />
</label>
