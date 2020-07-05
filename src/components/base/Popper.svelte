<script>
  import { createPopper } from '@popperjs/core'
  import produce from 'immer'
  import { onDestroy } from 'svelte'

  export let options = undefined
  export let show = false
  export let arrow = false

  let reference
  let popper
  let popperInstance
  let popperState

  const css = (obj = {}) =>
    Object.entries(obj)
      .map((kv) => kv.join(':'))
      .join(';')

  // Disable applyStyles modifier, we apply ourselves.
  // Also hook update state modifier because the modifiers don't execute
  // immediately on createPopper (for some reason)
  $: popperOptions = produce(options || {}, (v) => {
    v.modifiers = v.modifiers || []
    v.modifiers.push(
      {
        name: 'applyStyles',
        enabled: false
      },
      {
        name: 'updateState',
        enabled: true,
        phase: 'write',
        fn: ({ state }) => (popperState = state)
      }
    )
  })

  $: show ? create() : destroy()

  // Set popper options whenever options changed
  $: popperInstance != null && popperInstance.setOptions(popperOptions)

  $: popperAttrs =
    popperState != null && popperState.attributes != null
      ? popperState.attributes.popper
      : {}

  $: popperStyle =
    popperState != null && popperState.styles != null
      ? css(popperState.styles.popper)
      : ''

  $: arrowStyle =
    popperState != null && popperState.styles != null
      ? css(popperState.styles.arrow)
      : ''

  function create() {
    popperInstance = createPopper(reference, popper, popperOptions)
  }

  function destroy() {
    if (popperInstance != null) {
      popperInstance.destroy()
      popperInstance = undefined
      // Dont clear popperState for correct transitions
    }
  }

  onDestroy(destroy)
</script>

<div bind:this={reference}>
  <slot name="reference" />
</div>
<div bind:this={popper} class="absolute z-10" {...popperAttrs} style={popperStyle}>
  {#if show}
    <slot />
  {/if}
  {#if arrow}
    <div data-popper-arrow class="absolute" style={arrowStyle}>
      <div
        class="absolute w-2 h-2 bg-gray-100 transform -translate-x-1/2
        -translate-y-1/2 rotate-45"
        class:hidden={!show}
      />
    </div>
  {/if}
</div>
