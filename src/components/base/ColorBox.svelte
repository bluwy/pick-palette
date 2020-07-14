<script>
  export let color: string
  export let small = false

  let sizeClass: string
  $: sizeClass = small ? 'w-4 h-4 rounded' : 'w-8 h-8 rounded-lg'
</script>

<div
  class="{sizeClass} border border-gray-500 transition-colors duration-75"
  style="background-color: {color};"
/>
