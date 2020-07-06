<script>
  import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
  import { tick } from 'svelte'
  import { fly } from 'svelte/transition'
  import Icon from 'svelte-fa'
  import { editingColorId, editingColorShadeIndex } from '@/store/editor'
  import { state, updateState } from '@/store/state'
  import { debounce } from '@/utils/common'
  import ButtonColor from '@/components/base/ButtonColor.svelte'
  import ColorPicker from '@/components/base/ColorPicker.svelte'

  let resetColorPicker

  $: currentColor = $state.projects[$state.selected].colors.find(
    (v) => v.id === $editingColorId
  )

  $: currentShade = currentColor && currentColor.shades[$editingColorShadeIndex]

  // Reset color picker whenver color or shade change
  $: if (currentColor && currentShade && resetColorPicker) {
    // Wait for changes to be reflected in ColorPicker prop, then reset
    tick().then(() => resetColorPicker())
  }

  // Slowly update shades, otherwise this would nuke history
  const updateShade = debounce((newShade) => {
    updateState((state) => {
      const color = state.projects[state.selected].colors.find(
        (v) => v.id === $editingColorId
      )

      color.shades[$editingColorShadeIndex] = newShade
    })
  }, 1000)
</script>

<div class="text-center">
  {#if currentColor != null}
    <div class="inline-block">
      <div class="flex flex-row space-x-2 py-5">
        {#each currentColor.shades as shade, i}
          <div class="flex flex-col justify-center items-center">
            <ButtonColor
              color={shade}
              on:click={() => ($editingColorShadeIndex = i)}
            />
            <div class="h-8">
              {#if i === $editingColorShadeIndex}
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
            on:input={(e) => updateShade(e.detail)}
          />
        </div>
      {/if}
    </div>
  {:else}
    <div>No</div>
  {/if}
</div>
