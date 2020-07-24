<script>
  import chroma from 'chroma-js'
  import { fly } from 'svelte/transition'
  import { clickOutside } from '/@/actions/click-outside'
  import {
    createColor,
    currentProjectId,
    currentColorId
  } from '/@/store/projects'
  import { genShadeTint } from '/@/utils/app'
  import ColorPicker from '/@/components/base/ColorPicker/Index.svelte'
  import Popper from '/@/components/base/Popper.svelte'

  export let show = false

  let color = chroma.random().hex()

  function handleOK() {
    // Opinionated shade generation. Maybe expand this in the future?
    const shades = genShadeTint(color, 9)
    const colorId = createColor(shades)
    $currentColorId = colorId
    show = false
  }
</script>

<div
  use:clickOutside
  class="inline-block"
  on:clickoutside={() => (show = false)}
>
  <Popper bind:show options={{ placement: 'bottom' }}>
    <div slot="reference">
      <slot />
    </div>
    <div
      transition:fly={{ y: 10, duration: 250 }}
      class="inline-block mt-2 p-3 bg-white border border-gray-300 shadow-lg"
    >
      <div class="flex justify-between items-center mb-2">
        <div class="opacity-70">Pick a color</div>
        <button class="button button--small" on:click={handleOK}>OK</button>
      </div>
      <ColorPicker bind:value={color} />
    </div>
  </Popper>
</div>
