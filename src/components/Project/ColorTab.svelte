<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Icon from 'svelte-fa'
  import chroma from 'chroma-js'
  import { simulate } from '@bjornlu/colorblind'
  import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
  import { faGripVertical } from '@fortawesome/free-solid-svg-icons'
  import { colorDeficiency } from '@/store/colorblind'
  import { isTouchscreen } from '@/store/media'
  import {
    currentColorId,
    currentProject,
    removeColor,
    renameColor,
    setCurrentColorId,
    setCurrentShadeIndex
  } from '@/store/projects'
  import ColorBox from '@/components/base/ColorBox.svelte'
  import EditableText from '@/components/base/EditableText.svelte'

  export let colorId: string

  const dispatch = createEventDispatcher()

  // Maybe be undefined if deleted
  $: color = $currentProject?.colors.find((v) => v.id === colorId)

  $: shades = (color?.shades ?? []).map((shade) => {
    const deficiency = $colorDeficiency

    if (deficiency == null) {
      return shade
    }

    const [r, g, b] = chroma(shade).rgb()
    const sim = simulate({ r, g, b }, deficiency)
    return chroma(sim.r, sim.g, sim.b).hex()
  })

  function clickColorBox(index: number) {
    setCurrentColorId(colorId)
    setCurrentShadeIndex(index)
  }

  function handleNameChange(e: Event) {
    renameColor((e.target as HTMLInputElement).value, { colorId })
  }
</script>

{#if color != null}
  <div
    class="tab"
    class:tab--active={colorId === $currentColorId}
    role="button"
    on:click={() => setCurrentColorId(colorId)}
  >
    <div class="flex flex-row justify-between items-center my-1">
      <div class="text-sm cursor-text truncate" on:click|stopPropagation>
        <EditableText
          class="w-full bg-transparent"
          value={color.name}
          title="Rename color"
          buttonProps={{ title: 'Click to rename color' }}
          on:change={handleNameChange}
        />
      </div>
      <div class="flex-shrink">
        <button
          title="Remove color"
          on:click|stopPropagation={() => removeColor({ colorId })}
        >
          <Icon
            class="text-gray-700 text-opacity-50 transition-colors duration-200
              hover:text-error-500 focus:text-error-500 hover:text-opacity-100
              focus:text-opacity-100"
            icon={faTrashAlt}
          />
        </button>
        {#if !$isTouchscreen}
          <div
            class="inline-block px-2 cursor-grab"
            title="Sort color order"
            on:click|stopPropagation
            on:mousedown={() => dispatch('candrag', true)}
          >
            <Icon
              class="text-gray-700 text-opacity-50 transition-colors
                duration-200 hover:text-opacity-100 focus:text-opacity-100"
              icon={faGripVertical}
            />
          </div>
        {/if}
      </div>
    </div>
    <ol class="flex space-x-1 sm:space-x-2">
      {#each shades as color, i}
        <li>
          <button on:click|stopPropagation={() => clickColorBox(i)}>
            <ColorBox {color} />
          </button>
        </li>
      {/each}
    </ol>
  </div>
{/if}

<style lang="postcss">
  .tab {
    @apply px-2 py-1 rounded-lg bg-transparent cursor-pointer transition-colors duration-300;
  }

  .tab:hover {
    @apply bg-gray-200 bg-opacity-50;
  }

  .tab--active {
    @apply bg-gray-200 bg-opacity-80;
  }
</style>
