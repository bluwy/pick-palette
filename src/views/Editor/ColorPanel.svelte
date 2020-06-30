<script>
  import produce from 'immer'
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'
  import { currentEditorView, editorViews } from '@/store/editor'
  import { dispatch, state } from '@/store/state'
  import { debounce, removeAndInsertElement } from '@/utils/common'
  import Button from '@/components/base/Button.svelte'
  import ColorTab from '@/components/ColorTab.svelte'

  let draggedColorName
  let dropIndex

  $: colors = $state.projects[$state.selected].colors

  $: orderedColors = produce(colors, (colors) => {
    if (draggedColorName != null && dropIndex != null) {
      const dragIndex = colors.findIndex((v) => v.name === draggedColorName)
      removeAndInsertElement(colors, dragIndex, dropIndex)
    }
  })

  function removeColor(colorName) {
    dispatch((state) => {
      const currentProject = state.projects[state.selected]

      currentProject.colors = currentProject.colors.filter(
        (v) => v.name !== colorName
      )
    })
  }

  function handleClickShade() {
    // TODO: Open edit view with shade context
    $currentEditorView = editorViews.editColor
  }

  function handleDragStart(colorName) {
    draggedColorName = colorName
    dropIndex = colors.findIndex((v) => v.name === colorName)
  }

  const handleDragEnter = debounce((colorName, e) => {
    const targetTab = e.target.closest('[draggable="true"]')

    if (targetTab == null) {
      return
    }

    const tabRect = targetTab.getBoundingClientRect()
    let colorIndex = colors.findIndex((v) => v.name === colorName)

    // If pointer in lower part of rect, drop to lower part
    if (e.clientY > tabRect.top + tabRect.height / 2) {
      colorIndex++
    }

    dropIndex = colorIndex
  }, 100)

  function handleDragEnd() {
    dispatch((state) => {
      state.projects[state.selected].colors = orderedColors
    })

    draggedColorName = undefined
    dropIndex = undefined
  }
</script>

<div class="flex flex-col h-full">
  <div class="flex flex-row justify-between items-center mb-5">
    <div class="opacity-70">Palette</div>
    <Button
      outline
      small
      on:click={() => ($currentEditorView = editorViews.newColor)}
    >
      Add color
    </Button>
  </div>
  <ul class="flex-grow overflow-y-auto space-y-1">
    {#each orderedColors as color (color.name)}
      <li
        transition:fade={{ duration: 200 }}
        animate:flip={{ duration: 250, delay: 100 }}
        class="h-20 relative flex justify-center items-center"
        draggable="true"
        on:dragstart={() => handleDragStart(color.name)}
        on:dragenter={(e) => color.name !== draggedColorName && handleDragEnter(color.name, e)}
        on:dragover|preventDefault
        on:dragend={handleDragEnd}
      >
        {#if color.name !== draggedColorName}
          <div transition:fade={{ duration: 200 }} class="absolute w-full">
            <ColorTab
              {...color}
              on:remove={() => removeColor(color.name)}
              on:clickshade={handleClickShade}
            />
          </div>
        {/if}
      </li>
    {:else}
      <li class="text-center">
        <p class="text-sm opacity-50 my-6">No colors yet</p>
      </li>
    {/each}
  </ul>
</div>
