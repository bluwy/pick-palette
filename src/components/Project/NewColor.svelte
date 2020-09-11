<script>
  import { fly } from 'svelte/transition'
  import chroma from 'chroma-js'
  import { clickOutside } from '/@/actions/click-outside'
  import { createPopperActions } from '/@/actions/popper'
  import { createColor, setCurrentColorId } from '/@/store/projects'
  import { genShadeTint } from '/@/utils/app'
  import ColorPicker from '/@/components/base/ColorPicker/Index.svelte'

  export let show = false

  const [ref, content] = createPopperActions()

  let color = chroma.random().hex()

  function handleOK() {
    // Opinionated shade generation. Maybe expand this in the future?
    const shades = genShadeTint(color, 9)
    const colorId = createColor(shades)
    setCurrentColorId(colorId)
    show = false
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
        transition:fly={{ y: 10, duration: 250 }}
        class="inline-block my-2 sm:m-2 bg-white border border-gray-300
        rounded-lg shadow-xl"
      >
        <div class="flex justify-between items-center mx-5 mt-3 mb-2">
          <div class="text-sm opacity-70">Add a new color</div>
          <button class="button button--small" on:click={handleOK}>OK</button>
        </div>
        <div class="p-3 pt-0">
          <ColorPicker bind:value={color} />
        </div>
      </div>
    </div>
  {/if}
</div>
