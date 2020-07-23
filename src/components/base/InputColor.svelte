<script>
  import chroma from 'chroma-js'
  import { fly } from 'svelte/transition'
  import { clickOutside } from '/@/actions/click-outside'
  import ColorBox from './ColorBox.svelte'
  import ColorPicker from './ColorPicker/Index.svelte'
  import Popper from './Popper.svelte'

  export let value: string
  export let hideInput = false
  export let vertical = false
  export let disabled = false

  let show = false

  // Set white by default
  if (!chroma.valid(value)) {
    value = '#ffffff'
  }

  // Whenever disbled toggled true, set show to false
  $: disabled && (show = false)

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
  <Popper
    bind:show
    options={{ placement: vertical ? 'bottom' : 'bottom-start' }}
  >
    <div
      slot="reference"
      class="flex items-center {vertical ? 'flex-col' : 'flex-row'}"
    >
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
    <div
      transition:fly={{ y: 10, duration: 250 }}
      class="inline-block mt-2 shadow-lg"
    >
      <ColorPicker bind:value />
    </div>
  </Popper>
</div>
