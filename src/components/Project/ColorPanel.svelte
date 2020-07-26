<script>
  import type { Color } from '/@/utils/types'
  import { produce } from 'immer'
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'
  import { sortColor, currentProject } from '/@/store/projects'
  import { debounce, removeAndInsertElement } from '/@/utils/common'
  import ColorTab from './ColorTab.svelte'

  let canDrag = false
  let draggedColorId: string
  let dropIndex: number

  let colors: Color[]
  $: colors = $currentProject.colors

  let orderedColors: Color[]
  $: orderedColors = produce(colors, (colors) => {
    if (draggedColorId != null && dropIndex != null) {
      const dragIndex = colors.findIndex((v) => v.id === draggedColorId)
      removeAndInsertElement(colors, dragIndex, dropIndex)
    }
  })

  function handleDragStart(colorId: string) {
    draggedColorId = colorId
    dropIndex = colors.findIndex((v) => v.id === colorId)
  }

  const handleDragEnter = debounce((colorId: string, e: DragEvent) => {
    const targetTab = (e.target as Element).closest('[draggable="true"]')

    if (targetTab == null) {
      return
    }

    const tabRect = targetTab.getBoundingClientRect()
    let colorIndex = colors.findIndex((v) => v.id === colorId)

    // If pointer in lower part of rect, drop to lower part
    if (e.clientY > tabRect.top + tabRect.height / 2) {
      colorIndex++
    }

    dropIndex = colorIndex
  }, 100)

  function handleDragEnd() {
    const dragIndex = colors.findIndex((v) => v.id === draggedColorId)

    sortColor(dragIndex, dropIndex)

    canDrag = false
    draggedColorId = undefined
    dropIndex = undefined
  }

  function handleCanDrag(e: CustomEvent) {
    canDrag = e.detail
  }
</script>

<div
  class="panel-width flex flex-col h-full border border-gray-300 rounded-lg
  shadow-xl"
>
  <div class="flex items-center mx-5 my-3">
    <div class="text-sm opacity-70">Color Palette</div>
  </div>
  <ul class="flex-grow px-3 mb-3 overflow-y-auto">
    {#each orderedColors as color (color.id)}
      <li
        animate:flip={{ duration: 250, delay: 100 }}
        in:fade={{ duration: 200, delay: 200 }}
        out:fade={{ duration: 200 }}
        class="h-20 relative flex justify-center items-center"
        draggable={canDrag}
        on:dragstart={() => handleDragStart(color.id)}
        on:dragenter={(e) => color.id !== draggedColorId && handleDragEnter(color.id, e)}
        on:dragover|preventDefault
        on:dragend={handleDragEnd}
      >
        {#if color.id !== draggedColorId}
          <div transition:fade={{ duration: 200 }} class="absolute w-full">
            <ColorTab colorId={color.id} on:candrag={handleCanDrag} />
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

<style>
  .panel-width {
    width: 370px;
  }
</style>
