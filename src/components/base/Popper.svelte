<script>
  import { createPopper } from '@popperjs/core'
  import { onDestroy } from 'svelte'

  export let options = undefined
  export let show = false
  export let state = undefined

  let reference
  let popper
  let popperInstance

  // Get popper state
  $: state = popperInstance != null ? popperInstance.state : undefined

  // Set popper options whenver options changed
  $: popperInstance != null && popperInstance.setOptions(options)

  $: show ? create() : destroy()

  const create = () => {
    popperInstance = createPopper(reference, popper, options)
  }

  const destroy = () => {
    if (popperInstance != null) {
      popperInstance.destroy()
      popperInstance = undefined
    }
  }

  onDestroy(destroy)
</script>

<div bind:this={reference}>
  <slot name="reference" />
</div>
<div bind:this={popper}>
  {#if show}
    <slot />
  {/if}
</div>
