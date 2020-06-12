<script>
  export let props = {}
  export let outline = false
</script>

<button
  class="bg-primary-500 border-2 border-primary-500 rounded px-3 py-1
  transition-colors duration-200 {outline ? 'text-primary-800 bg-opacity-0 hover:bg-opacity-20 focus:bg-opacity-20' : 'text-white hover:bg-opacity-80 focus:bg-opacity-80'}"
  {...props}
  on:click
>
  <slot />
</button>
