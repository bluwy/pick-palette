<script>
  export let props = {}
  export let value
</script>

<input
  class="placeholder-black rounded px-3 py-1 border border-gray-500 bg-gray-500
  bg-opacity-10 transition-colors duration-200 hover:bg-primary-500
  hover:bg-opacity-20 hover:border-primary-500 focus:bg-primary-500
  focus:bg-opacity-20 focus:border-primary-500"
  bind:value
  {...props}
/>
