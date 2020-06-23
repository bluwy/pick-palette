<script>
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'
  import { currentEditorView, editorViews } from '@/store/editor'
  import { dispatch, state } from '@/store/state'
  import { removeAndInsertElement } from '@/utils/common'
  import Button from './base/Button.svelte'
  import ColorTab from './ColorTab.svelte'

  $: project = $state.projects[$state.selected]

  let draggedColorName
  let dropIndex
  let tabs

  $: {
    const colorTabs = project.colors.map((v) => ({
      key: v.name,
      color: v
    }))

    if (dropIndex != null) {
      colorTabs.splice(dropIndex, 0, {
        key: 'dropzone',
        dropzone: true
      })
    }

    // tabs will either be in object form of:
    // { key: '<color-name>', color: {} } or
    // { key: 'dropzone', dropzone: true }
    tabs = colorTabs
  }

  const removeColor = (colorName) => {
    dispatch((state) => {
      const currentProject = state.projects[state.selected]

      currentProject.colors = currentProject.colors.filter(
        (v) => v.name !== colorName
      )
    })
  }

  const handleClickShade = () => {
    // TODO: Open edit view with shade context
    // Open color edit view
    $currentEditorView = editorViews.editColor
  }

  const handleDrag = (colorName, e) => {
    draggedColorName = colorName
  }

  // Use ref instead of event because event.target is not ref :(
  const handleDragEnter = (colorName, e) => {
    // const targetRect = e.target.getBoundingClientRect()
    let targetIndex = project.colors.findIndex((v) => v.name === colorName)

    // If pointer in lower part of rect, drop to lower part
    // if (e.clientY > targetRect.top + targetRect.height / 2) {
    //   targetIndex++
    // }

    dropIndex = targetIndex
  }

  const handleDrop = () => {
    dispatch((state) => {
      const currentProject = state.projects[state.selected]
      const dragIndex = currentProject.colors.findIndex(
        (v) => v.name === draggedColorName
      )

      removeAndInsertElement(currentProject.colors, dragIndex, dropIndex)
    })
  }

  // Dragend is called after drop event, do cleanup
  const handleDragEnd = () => {
    draggedColorName = undefined
    dropIndex = undefined
  }
</script>

<div class="flex flex-row justify-between items-center mb-5">
  <div class="opacity-70">Palette</div>
  <Button outline on:click={() => ($currentEditorView = editorViews.newColor)}>
    Add color
  </Button>
</div>

<ul class="mb-4 space-y-4">
  {#each tabs as tab (tab.key)}
    <li
      transition:fade={{ duration: 200 }}
      animate:flip={{ duration: 300, delay: 100 }}
      draggable="true"
      on:drag={(e) => handleDrag(tab.color.name, e)}
      on:dragenter={(e) => !tab.dropzone && handleDragEnter(tab.color.name, e)}
      on:dragover|preventDefault
      on:dragend={handleDragEnd}
      on:drop={handleDrop}
    >
      {#if tab.dropzone}
        <div class="text-center">
          <p class="text-sm opacity-50 py-6">Drop here</p>
        </div>
      {:else if tab.color.name === draggedColorName}
        <div transition:fade={{ duration: 200 }} />
      {:else}
        <div transition:fade={{ duration: 200 }}>
          <ColorTab
            {...tab.color}
            on:remove={() => removeColor(tab.color.name)}
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
