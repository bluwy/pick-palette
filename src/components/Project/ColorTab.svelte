<script>
  import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
  import { faGripVertical } from '@fortawesome/free-solid-svg-icons'
  import { createEventDispatcher } from 'svelte'
  import Icon from 'svelte-fa'
  import { navigateTo } from 'svelte-router-spa'
  import { state } from '@/store/state'
  import ButtonColor from '@/components/base/ButtonColor.svelte'

  export let currentRoute

  // Must exist in state data
  export let id

  $: projectId = currentRoute.namedParams.projectid

  $: color = $state.projects
    .find((v) => v.id === projectId)
    .colors.find((v) => v.id === id)

  $: shades = color != null ? color.shades : []

  const dispatch = createEventDispatcher()

  function removeSelf() {
    state.update('Remove color', (state) => {
      const colors = state.projects.find((v) => v.id === projectId).colors
      const index = colors.findIndex((v) => v.id === id)
      colors.splice(index, 1)
    })
  }

  function updateName(newName) {
    state.update('Update color name', (state) => {
      const colors = state.projects.find((v) => v.id === projectId).colors
      colors.find((v) => v.id === id).name = newName
    })
  }

  function handleClickShade(shadeIndex) {
    navigateTo(`project/${projectId}/edit/${id}/${shadeIndex}`)
  }
</script>

<div
  class="rounded p-3 bg-gray-500 bg-opacity-0 transition-colors duration-200
  hover:bg-opacity-10"
>
  <div class="flex flex-row justify-between mb-2">
    <div>
      <input
        class="input--small input--transparent w-1/2 truncate max-w-full -mx-2
        -my-sm"
        type="text"
        value={color.name}
        on:change={(e) => updateName(e.target.value)}
      />
    </div>
    <div>
      <button class="button--transparent" on:click={removeSelf}>
        <Icon
          class="text-gray-700 text-opacity-50 transition-colors duration-200
          hover:text-error-500 focus:text-error-500 hover:text-opacity-100
          focus:text-opacity-100"
          icon={faTrashAlt}
        />
      </button>
      <div
        class="inline-block px-2 cursor-grab"
        on:mousedown={() => dispatch('candrag', true)}
      >
        <Icon
          class="text-gray-700 text-opacity-50 transition-colors duration-200
          hover:text-opacity-100 focus:text-opacity-100"
          icon={faGripVertical}
        />
      </div>
    </div>
  </div>
  <ol class="flex flex-row justify-between">
    {#each shades as color, i}
      <li>
        <ButtonColor {color} on:click={() => handleClickShade(i)} />
      </li>
    {/each}
  </ol>
</div>
