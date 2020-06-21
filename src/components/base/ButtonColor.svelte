<script>
  export let color
  export let disabled = false
</script>

<button
  class="w-8 h-8 rounded-lg border border-gray-500 transition-colors duration-75"
  style="background-color: {color};"
  {disabled}
  on:click
/>
