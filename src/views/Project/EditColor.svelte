<script>
  import type { Color } from '/@/utils/types'
  import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
  import { tick } from 'svelte'
  import { fly } from 'svelte/transition'
  import Icon from 'svelte-fa'
  import {
    currentColorId,
    currentProject,
    currentShadeIndex,
    updateColorShade,
    setCurrentShadeIndex
  } from '/@/store/projects'
  import ColorBox from '/@/components/base/ColorBox.svelte'
  import ColorPicker from '/@/components/base/ColorPicker/Index.svelte'

  // Function bound from color picker
  let resetColorPicker: Function

  let currentColor: Color
  $: currentColor = $currentProject.colors.find((v) => v.id === $currentColorId)

  // May be undefined if out of bounds
  let currentShade: string
  $: currentShade = currentColor?.shades[$currentShadeIndex]

  // Reset color picker whenever color or shade change
  $: if (currentColor && currentShade && resetColorPicker) {
    // Wait for changes to be reflected in ColorPicker prop, then reset
    tick().then(() => resetColorPicker())
  }
</script>

<div class="text-center">
  {#if currentColor != null}
    <div class="inline-block">
      <div class="flex flex-row space-x-2 py-5">
        {#each currentColor.shades as shade, i}
          <div class="flex flex-col justify-center items-center">
            <button on:click={() => setCurrentShadeIndex(i)}>
              <ColorBox color={shade} />
            </button>
            <div class="h-8">
              {#if i === $currentShadeIndex}
                <div
                  transition:fly={{ y: 10 }}
                  class="text-gray-900 opacity-70 pt-3"
                >
                  <Icon icon={faChevronUp} />
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
    <div>
      {#if currentShade != null}
        <div class="inline-block">
          <ColorPicker
            value={currentShade}
            bind:reset={resetColorPicker}
            on:input={(e) => updateColorShade(e.detail)}
          />
        </div>
      {/if}
    </div>
  {:else}
    <div>No</div>
  {/if}
</div>
