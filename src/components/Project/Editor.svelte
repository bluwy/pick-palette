<script>
  import type { Color } from '/@/utils/types'
  import {
    faChevronUp,
    faChevronLeft,
    faChevronRight
  } from '@fortawesome/free-solid-svg-icons'
  import { tick } from 'svelte'
  import { fly } from 'svelte/transition'
  import Icon from 'svelte-fa'
  import {
    currentColor,
    currentProject,
    currentShade,
    currentShadeIndex,
    updateColorShade,
    setCurrentShadeIndex,
    goNextColorId,
    goPrevColorId,
    renameColor,
    setCurrentColorId
  } from '/@/store/projects'
  import ColorBox from '/@/components/base/ColorBox.svelte'
  import ColorPicker from '/@/components/base/ColorPicker/Index.svelte'
  import EditableText from '/@/components/base/EditableText.svelte'
  import NewColor from './NewColor.svelte'

  // Function bound from color picker
  let resetColorPicker: Function

  // Set a default color if none
  $: if ($currentColor == null && $currentProject.colors.length > 0) {
    setCurrentColorId($currentProject.colors[0].id)
  }

  // Reset color picker whenever color or shade change
  $: if ($currentColor && $currentShade && resetColorPicker) {
    // Wait for changes to be reflected in ColorPicker prop, then reset
    tick().then(() => resetColorPicker())
  }

  function handleNameChange(e: Event) {
    renameColor((e.target as HTMLInputElement).value)
  }
</script>

<div class="h-full text-center p-6 bg-gray-100 overflow-y-auto">
  {#if $currentColor != null}
    <div class="flex justify-center items-center w-full max-w-sm mx-auto">
      <button
        class="flex-shrink p-4 opacity-30 transition-opacity duration-200
        hover:opacity-50 focus:opacity-50"
        on:click={() => goPrevColorId()}
      >
        <Icon icon={faChevronLeft} />
      </button>
      <div class="flex-grow">
        <div>
          <EditableText
            class="text-center"
            value={$currentColor.name}
            size={7}
            on:change={handleNameChange}
          />
        </div>
      </div>
      <button
        class="flex-shrink p-4 opacity-30 transition-opacity duration-200
        hover:opacity-50 focus:opacity-50"
        on:click={() => goNextColorId()}
      >
        <Icon icon={faChevronRight} />
      </button>
    </div>
    <div class="inline-block">
      <div class="flex flex-row space-x-2 py-5">
        {#each $currentColor.shades as shade, i}
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
      {#if $currentShade != null}
        <div class="inline-block">
          <ColorPicker
            value={$currentShade}
            bind:reset={resetColorPicker}
            on:input={(e) => updateColorShade(e.detail)}
          />
        </div>
      {/if}
    </div>
  {:else}
    <div class="flex flex-col h-full justify-center items-center">
      <p class="text-xl mb-3">Welcome to a new project</p>
      <NewColor>
        <button class="button">Pick a color</button>
      </NewColor>
    </div>
  {/if}
</div>
