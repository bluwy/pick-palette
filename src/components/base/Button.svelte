<script>
  export let outline = false
</script>

<button
  class="bg-purple-500 border-2 border-purple-500 rounded-lg px-3 py-1
  transition-colors duration-200 {outline ? 'text-purple-800 bg-opacity-0 hover:bg-opacity-25 focus:bg-opacity-25' : 'text-white hover:bg-opacity-75 focus:bg-opacity-75'}"
  on:click
>
  <slot />
</button>
