<script>
  import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
  import { fly } from 'svelte/transition'
  import Icon from 'svelte-fa'
  import InputColor from './base/InputColor.svelte'

  export let value
  export let label = ''
  export let highlight = false
</script>

<div class="flex flex-col justify-center items-center">
  <div class="h-8">
    {#if highlight}
      <div transition:fly={{ y: -15 }} class="text-gray-900 opacity-70">
        <Icon icon={faChevronDown} />
      </div>
    {/if}
  </div>
  {#if label}
    <div class="mb-2">{label}</div>
  {/if}
  <InputColor bind:value vertical />
</div>
