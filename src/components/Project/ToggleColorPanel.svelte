<script>
  import { faPalette } from '@fortawesome/free-solid-svg-icons'
  import { fly } from 'svelte/transition'
  import Icon from 'svelte-fa'
  import { clickOutside } from '/@/actions/click-outside'
  import Popper from '/@/components/base/Popper.svelte'
  import ColorPanel from './ColorPanel.svelte'

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
  <Popper bind:show>
    <button
      slot="reference"
      class="button button--icon lg:hidden"
      class:button--icon--active={show}
      on:click={() => (show = !show)}
    >
      <Icon icon={faPalette} />
    </button>
    <div
      bind:this={panel}
      transition:fly={{ y: 10, duration: 250 }}
      class="inline-block m-2 shadow-lg"
      style="height: {maxPanelHeight}px;"
    >
      <ColorPanel />
    </div>
  </Popper>
</div>
