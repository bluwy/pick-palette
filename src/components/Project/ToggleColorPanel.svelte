<script>
  import { fly } from 'svelte/transition'
  import { createPopperActions } from '/@/actions/popper'
  import { clickOutside } from '/@/actions/click-outside'
  import ColorPanel from './ColorPanel.svelte'

  const [ref, content] = createPopperActions()

  export let show = false

  let panel: HTMLElement | undefined

  let maxPanelHeight: number | undefined
  $: if (panel != null) {
    const panelRect = panel.getBoundingClientRect()

    if (panelRect.bottom > window.innerHeight) {
      maxPanelHeight = window.innerHeight - panelRect.top + window.scrollY
    } else {
      maxPanelHeight = undefined
    }
  }
</script>

<div
  use:clickOutside
  class="inline-block"
  on:clickoutside={() => (show = false)}
>
  <div use:ref on:click={() => (show = !show)}>
    <slot {show} />
  </div>
  {#if show}
    <div use:content={{ placement: 'auto' }} class="absolute z-10">
      <div
        bind:this={panel}
        transition:fly={{ y: 10, duration: 250 }}
        class="inline-block m-2 shadow-lg"
        style="height: {maxPanelHeight}px;"
      >
        <ColorPanel />
      </div>
    </div>
  {/if}
</div>
