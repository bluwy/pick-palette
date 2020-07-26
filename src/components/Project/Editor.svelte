<script>
  import type { Color } from '/@/utils/types'
  import {
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
  import EditorHeader from './EditorHeader.svelte'
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

<div class="flex flex-col h-full pl-6">
  <div class="flew-shrink py-1">
    <EditorHeader />
  </div>
  <div class="flex-grow text-center overflow-y-auto">
    {#if $currentColor != null}
      <div class="flex justify-center items-center w-full max-w-xs mx-auto">
        <button
          class="flex-shrink p-4 opacity-30 transition-opacity duration-200
          hover:opacity-50 focus:opacity-50"
          on:click={() => goPrevColorId()}
        >
          <Icon icon={faChevronLeft} />
        </button>
        <div class="flex-grow">
          <EditableText
            class="text-center bg-transparent"
            value={$currentColor.name}
            size={9}
            on:change={handleNameChange}
          />
        </div>
        <button
          class="flex-shrink p-4 opacity-30 transition-opacity duration-200
          hover:opacity-50 focus:opacity-50"
          on:click={() => goNextColorId()}
        >
          <Icon icon={faChevronRight} />
        </button>
      </div>
      <ol class="flex justify-center items-center space-x-3 mt-3 mb-8">
        {#each $currentColor.shades as shade, i}
          <li class="flex flex-col justify-center items-center">
            <button
              class="transition-a;; duration-100 transform {i === $currentShadeIndex ? 'mx-2 scale-150' : 'hover:scale-125'}"
              on:click={() => setCurrentShadeIndex(i)}
            >
              <ColorBox color={shade} />
            </button>
          </li>
        {/each}
      </ol>
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
</div>
