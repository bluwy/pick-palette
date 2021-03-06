<script lang="ts">
  import { tick } from 'svelte'
  import Icon from 'svelte-fa'
  import {
    faChevronLeft,
    faChevronRight
  } from '@fortawesome/free-solid-svg-icons'
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
  } from '@/store/projects'
  import ColorPicker from '@/components/base/ColorPicker/Index.svelte'
  import ColorBox from '@/components/base/ColorBox.svelte'
  import EditableText from '@/components/base/EditableText.svelte'
  import NewColor from './NewColor.svelte'

  // Function bound from color picker
  let resetColorPicker: () => void

  $: currentProjectColors = $currentProject?.colors ?? []

  // Set a default color if none
  $: if ($currentColor == null && currentProjectColors.length > 0) {
    setCurrentColorId(currentProjectColors[0].id)
  }

  $: currentColorShades = $currentColor?.shades ?? []

  // Set default shade if none
  $: if ($currentShadeIndex < 0 && currentColorShades.length > 0) {
    setCurrentShadeIndex(Math.floor((currentColorShades.length ?? 0) / 2))
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

{#if $currentColor != null}
  <div class="flex justify-center items-center w-full max-w-xs mx-auto my-6">
    <button
      class="flex-shrink p-4 opacity-30 transition-opacity duration-200
        hover:opacity-50 focus:opacity-50"
      class:hidden={currentProjectColors.length <= 0}
      title="Select previous color"
      on:click={() => goPrevColorId()}
    >
      <Icon icon={faChevronLeft} />
    </button>
    <div class="flex-grow text-center py-4">
      <EditableText
        class="text-center bg-transparent"
        value={$currentColor?.name ?? ''}
        size={9}
        title="Rename color"
        buttonProps={{ title: 'Click to rename color' }}
        on:change={handleNameChange}
      />
    </div>
    <button
      class="flex-shrink p-4 opacity-30 transition-opacity duration-200
        hover:opacity-50 focus:opacity-50"
      class:hidden={currentProjectColors.length <= 0}
      title="Select next color"
      on:click={() => goNextColorId()}
    >
      <Icon icon={faChevronRight} />
    </button>
  </div>
  <ol
    class="flex justify-center items-center space-x-2 sm:space-x-3 mt-8 mb-12"
  >
    {#each currentColorShades as shade, i}
      <li class="flex flex-col justify-center items-center">
        <button
          class="transition-all duration-100 transform {i === $currentShadeIndex
            ? 'mx-2 scale-150'
            : 'hover:scale-125'}"
          aria-label="Edit shade {(i + 1) * 100}"
          on:click={() => setCurrentShadeIndex(i)}
        >
          <ColorBox color={shade} />
        </button>
      </li>
    {/each}
  </ol>
  <div class="text-center">
    {#if $currentShade != null}
      <div class="inline-block">
        <ColorPicker
          value={$currentShade ?? ''}
          bind:reset={resetColorPicker}
          on:input={(e) => updateColorShade(e.detail)}
        />
      </div>
    {/if}
  </div>
{:else}
  <div class="flex flex-col h-full justify-center items-center">
    <p class="text-xl mb-3">Welcome to a new project</p>
    <NewColor><button class="button">Pick a color</button></NewColor>
  </div>
{/if}
