<script>
  import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
  import { createEventDispatcher } from 'svelte'
  import Icon from 'svelte-fa'
  import ButtonColor from './base/ButtonColor.svelte'

  export let name
  export let shades

  const dispatch = createEventDispatcher()
</script>

<div class="flex flex-row justify-between mb-2">
  <div class="opacity-80">{name}</div>
  <button on:click={() => dispatch('remove')}>
    <Icon
      class="text-gray-700 text-opacity-50 transition-colors duration-200
      hover:text-error-500 focus:text-error-500 hover:text-opacity-100
      focus:text-opacity-100"
      icon={faTrashAlt}
    />
  </button>
</div>

<ol class="flex flex-row justify-between">
  {#each shades as color, index}
    <li>
      <ButtonColor
        {color}
        on:click={() => dispatch('clickshade', { index, color })}
      />
    </li>
  {/each}
</ol>
