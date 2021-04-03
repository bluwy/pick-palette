<script lang="ts">
  import { fly } from 'svelte/transition'
  import { createPopperActions } from 'svelte-popperjs'
  import chroma from 'chroma-js'
  import { clickOutside } from '@/actions/click-outside'
  import ColorPicker from './ColorPicker/Index.svelte'
  import ColorBox from './ColorBox.svelte'

  export let value: string
  export let hideInput = false
  export let vertical = false
  export let disabled = false

  const [ref, content] = createPopperActions()

  let show = false

  // Set white by default
  if (!chroma.valid(value)) {
    value = '#ffffff'
  }

  // Whenever disbled toggled true, set show to false
  $: if (disabled) {
    show = false
  }

  // Make sure value is hex string
  function setValueAsHex() {
    value = chroma(value).hex()
  }
</script>

<div
  use:clickOutside
  class="inline-block"
  on:clickoutside={() => (show = false)}
>
  <div use:ref class="flex items-center {vertical ? 'flex-col' : 'flex-row'}">
    <button {disabled} on:click={() => (show = !disabled)}>
      <ColorBox color={value} />
    </button>
    {#if !hideInput}
      <input
        bind:value
        class={`input ${vertical ? 'mt-2' : 'ml-2'}}`}
        type="text"
        size={4}
        {disabled}
        on:change={setValueAsHex}
      />
    {/if}
  </div>
  {#if show}
    <div
      use:content={{ placement: vertical ? 'bottom' : 'bottom-start' }}
      class="absolute z-10"
    >
      <div
        transition:fly={{ y: 10, duration: 250 }}
        class="inline-block m-2 shadow-lg"
      >
        <ColorPicker bind:value />
      </div>
    </div>
  {/if}
</div>
