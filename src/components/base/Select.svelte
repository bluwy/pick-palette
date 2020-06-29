<script>
  export let value
  export let props = {}
  // Accepts array of objects with label and value keys
  export let choices
</script>

<select
  bind:value
  {...props}
  class="rounded px-3 py-1 border border-gray-500 bg-gray-500 bg-opacity-10
  transition-all duration-200"
>
  {#each choices as choice}
    <option value={choice.value}>{choice.label}</option>
  {/each}
</select>
