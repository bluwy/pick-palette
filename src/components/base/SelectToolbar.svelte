<script>
  export let value: string
  // Accepts array of objects with label and value keys
  export let choices: { label: string; value: string }[]
</script>

<div
  class="inline-block rounded bg-white border border-gray-500 overflow-hidden
    divide-x-2"
>
  {#each choices as choice}
    <label
      class="inline-block cursor-pointer px-3 py-1 bg-primary-500 bg-opacity-0
        transition-colors duration-200 {choice.value === value ? 'bg-opacity-100 text-white hover:bg-opacity-80 focus:bg-opacity-80' : 'hover:bg-opacity-30 focus:bg-opacity-30'}"
      tabindex={0}
    >
      <span>{choice.label}</span>
      <input
        class="hidden"
        type="radio"
        bind:group={value}
        value={choice.value}
      />
    </label>
  {/each}
</div>
