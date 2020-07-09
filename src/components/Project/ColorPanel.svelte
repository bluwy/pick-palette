<script>
  import { produce } from 'immer'
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'
  import { navigateTo } from 'svelte-router-spa'
  import { state } from '@/store/state'
  import { debounce, removeAndInsertElement } from '@/utils/common'
  import ColorTab from './ColorTab.svelte'

  export let currentRoute

  let canDrag = false
  let draggedColorId
  let dropIndex

  $: projectId = currentRoute.namedParams.projectid

  $: colors = $state.projects.find((v) => v.id === projectId).colors

  $: orderedColors = produce(colors, (colors) => {
    if (draggedColorId != null && dropIndex != null) {
      const dragIndex = colors.findIndex((v) => v.id === draggedColorId)
      removeAndInsertElement(colors, dragIndex, dropIndex)
    }
  })

  function handleDragStart(colorId) {
    draggedColorId = colorId
    dropIndex = colors.findIndex((v) => v.id === colorId)
  }

  const handleDragEnter = debounce((colorId, e) => {
    const targetTab = e.target.closest('[draggable="true"]')

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
    state.update('Sort color order', (state) => {
      const colors = state.projects.find((v) => v.id === projectId).colors
      const dragIndex = colors.findIndex((v) => v.id === draggedColorId)
      removeAndInsertElement(colors, dragIndex, dropIndex)
    })

    canDrag = false
    draggedColorId = undefined
    dropIndex = undefined
  }
</script>

<div class="flex flex-col h-full">
  <div class="flex flex-row justify-between items-center mb-5">
    <div class="opacity-70">Palette</div>
    <button
      class="button--outline button--small"
      on:click={() => navigateTo(`project/${projectId}/new`)}
    >
      Add color
    </button>
  </div>
  <ul class="flex-grow overflow-y-auto space-y-1">
    {#each orderedColors as color (color.id)}
      <li
        transition:fade={{ duration: 200 }}
        animate:flip={{ duration: 250, delay: 100 }}
        class="h-20 relative flex justify-center items-center"
        draggable={canDrag}
        on:dragstart={() => handleDragStart(color.id)}
        on:dragenter={(e) => color.id !== draggedColorId && handleDragEnter(color.id, e)}
        on:dragover|preventDefault
        on:dragend={handleDragEnd}
      >
        {#if color.id !== draggedColorId}
          <div transition:fade={{ duration: 200 }} class="absolute w-full">
            <ColorTab
              id={color.id}
              {currentRoute}
              on:candrag={(e) => (canDrag = e.detail)}
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