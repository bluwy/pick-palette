<script>
  import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
  import { tick } from 'svelte'
  import { fly } from 'svelte/transition'
  import Icon from 'svelte-fa'
  import {
    editorViews,
    currentEditorView,
    editingColorId,
    editingColorShadeIndex
  } from '@/store/editor'
  import { selectedProjectId } from '@/store/project'
  import { state } from '@/store/state'
  import { debounce } from '@/utils/common'
  import ButtonColor from '@/components/base/ButtonColor.svelte'
  import ColorPicker from '@/components/base/ColorPicker.svelte'

  // Break merge after 500ms of inactivity
  const debounceBreakMerge = debounce(state.breakMerge, 500)

  let resetColorPicker
  let shadeIndex

  $: currentColor = $state.projects
    .find((v) => v.id === $selectedProjectId)
    .colors.find((v) => v.id === $editingColorId)

  $: if (currentColor == null) {
    // May be null because deleted, if so go to empty view
    $currentEditorView = editorViews.empty
  }

  $: if (
    currentColor &&
    currentColor.shades &&
    $editingColorShadeIndex >= 0 &&
    $editingColorShadeIndex < currentColor.shades.length
  ) {
    shadeIndex = $editingColorShadeIndex
  } else {
    shadeIndex = -1
  }

  $: currentShade = currentColor && currentColor.shades[shadeIndex]

  // Reset color picker whenver color or shade change
  $: if (currentColor && currentShade && resetColorPicker) {
    // Wait for changes to be reflected in ColorPicker prop, then reset
    tick().then(() => resetColorPicker())
  }

  function updateShade(newShade) {
    if (shadeIndex < 0) {
      return
    }

    state.update(
      'Update shade',
      (state) => {
        const color = state.projects
          .find((v) => v.id === $selectedProjectId)
          .colors.find((v) => v.id === $editingColorId)

        color.shades[shadeIndex] = newShade
      },
      { merge: true }
    )

    debounceBreakMerge()
  }
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
              {#if i === shadeIndex}
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
