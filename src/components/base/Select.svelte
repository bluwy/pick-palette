<script>
  export let value: string | undefined = undefined
  export let choices: { label: string; value?: string }[]
</script>

<select bind:value class="input input--small" {...$$restProps}>
  {#each choices as choice}
    <option value={choice.value}>{choice.label}</option>
  {/each}
</select>
