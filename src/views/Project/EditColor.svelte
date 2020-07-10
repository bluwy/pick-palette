<script>
  import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
  import { tick } from 'svelte'
  import { fly } from 'svelte/transition'
  import Icon from 'svelte-fa'
  import { navigateTo } from 'svelte-router-spa'
  import { state } from '@/store/state'
  import { debounce } from '@/utils/common'
  import ColorBox from '@/components/base/ColorBox.svelte'
  import ColorPicker from '@/components/base/ColorPicker/Index.svelte'

  export let currentRoute

  // Break merge after 500ms of inactivity
  const debounceBreakMerge = debounce(state.breakMerge, 500)

  let resetColorPicker
  let computedShadeIndex

  $: projectId = currentRoute.namedParams.projectid
  $: colorId = currentRoute.namedParams.colorid
  $: shadeIndex = +currentRoute.namedParams.shadeindex

  $: currentColor = $state.projects
    .find((v) => v.id === projectId)
    .colors.find((v) => v.id === colorId)

  $: if (currentColor == null) {
    // May be null because deleted, if so go to empty view
    navigateTo(`project/${projectId}`)
  }

  $: if (
    currentColor &&
    currentColor.shades &&
    shadeIndex >= 0 &&
    shadeIndex < currentColor.shades.length
  ) {
    computedShadeIndex = shadeIndex
  } else {
    computedShadeIndex = -1
  }

  $: currentShade = currentColor && currentColor.shades[computedShadeIndex]

  // Reset color picker whenver color or shade change
  $: if (currentColor && currentShade && resetColorPicker) {
    // Wait for changes to be reflected in ColorPicker prop, then reset
    tick().then(() => resetColorPicker())
  }

  function updateShade(newShade) {
    if (computedShadeIndex < 0) {
      return
    }

    state.update(
      'Update shade',
      (state) => {
        const color = state.projects
          .find((v) => v.id === projectId)
          .colors.find((v) => v.id === colorId)

        color.shades[computedShadeIndex] = newShade
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
            <button
              on:click={() => navigateTo(`project/${projectId}/edit/${colorId}/${i}`)}
            >
              <ColorBox color={shade} />
            </button>
            <div class="h-8">
              {#if i === computedShadeIndex}
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
