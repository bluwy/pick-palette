<script>
  import chroma from 'chroma-js'
  import { fly } from 'svelte/transition'
  import { clickOutside } from '@/actions/click-outside'
  import ButtonColor from './ButtonColor.svelte'
  import ColorPicker from './ColorPicker/Index.svelte'
  import Popper from './Popper.svelte'

  export let value
  export let vertical = false
  export let disabled = false

  let show

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
      <div class={vertical ? 'mb-2' : 'mr-2'}>
        <ButtonColor
          color={value}
          {disabled}
          on:click={() => (show = !disabled)}
        />
      </div>
      <input
        bind:value
        type="text"
        size="4"
        {disabled}
        on:change={setValueAsHex}
      />
    </div>
    <div
      transition:fly={{ y: 10, duration: 250 }}
      class="inline-block mt-2 shadow-lg"
    >
      <ColorPicker bind:value />
    </div>
  </Popper>
</div>
