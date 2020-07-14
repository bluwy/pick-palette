<script>
  import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
  import { tick } from 'svelte'
  import { fly } from 'svelte/transition'
  import Icon from 'svelte-fa'
  import { useNavigate, useParams } from 'svelte-navigator'
  import {
    currentProject,
    currentProjectId,
    updateColorShade
  } from '/@/store/project'
  import ColorBox from '/@/components/base/ColorBox.svelte'
  import ColorPicker from '/@/components/base/ColorPicker/Index.svelte'

  const navigate = useNavigate()
  const params = useParams()

  // Function bound from color picker
  let resetColorPicker

  $: colorId = $params.colorId
  $: shadeIndex = +$params.shadeIndex

  $: currentColor = $currentProject.colors.find((v) => v.id === colorId)

  // Check null in case color got deleted, if so go to empty view
  $: if (currentColor == null) {
    navigate(`/project/${$currentProjectId}`)
  }

  // May be undefined if out of bounds
  $: currentShade = currentColor?.shades[shadeIndex]

  // Reset color picker whenever color or shade change
  $: if (currentColor && currentShade && resetColorPicker) {
    // Wait for changes to be reflected in ColorPicker prop, then reset
    tick().then(() => resetColorPicker())
  }

  function updateShade(newShade) {
    if (shadeIndex >= 0 && shadeIndex < currentColor.shades.length) {
      updateColorShade(colorId, shadeIndex, newShade)
    }
  }
</script>

<div class="text-center">
  {#if currentColor != null}
    <div class="inline-block">
      <div class="flex flex-row space-x-2 py-5">
        {#each currentColor.shades as shade, i}
          <div class="flex flex-col justify-center items-center">
            <button
              on:click={() => navigate(
                  `/project/${$currentProjectId}/edit/${colorId}/${i}`,
                  { replace: true }
                )}
            >
              <ColorBox color={shade} />
            </button>
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
