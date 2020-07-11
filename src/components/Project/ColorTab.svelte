<script>
  import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
  import { faGripVertical } from '@fortawesome/free-solid-svg-icons'
  import { createEventDispatcher } from 'svelte'
  import Icon from 'svelte-fa'
  import { navigate, useLocation, useParams } from 'svelte-navigator'
  import { state } from '@/store/state'
  import ColorBox from '@/components/base/ColorBox.svelte'

  // Must exist in state data
  export let colorId

  const params = useParams()
  const location = useLocation()

  $: projectId = $params.projectId

  $: color = $state.projects
    .find((v) => v.id === projectId)
    .colors.find((v) => v.id === colorId)

  $: shades = color != null ? color.shades : []

  const dispatch = createEventDispatcher()

  function removeSelf() {
    state.update('Remove color', (state) => {
      const colors = state.projects.find((v) => v.id === projectId).colors
      const index = colors.findIndex((v) => v.id === colorId)
      colors.splice(index, 1)
    })
  }

  function updateName(newName) {
    state.update('Update color name', (state) => {
      const colors = state.projects.find((v) => v.id === projectId).colors
      colors.find((v) => v.id === colorId).name = newName
    })
  }

  function handleClickShade(shadeIndex) {
    const isEditView = /project\/[^\/]*\/edit\//.test($location.pathname)
    // If editing, we can just replace the link
    navigate(`/project/${projectId}/edit/${colorId}/${shadeIndex}`, {
      replace: isEditView
    })
  }
</script>

<div
  class="rounded px-3 py-2 bg-gray-500 bg-opacity-0 transition-colors
  duration-200 hover:bg-opacity-10"
>
  <div class="flex flex-row justify-between mb-2">
    <div class="flex-grow">
      <input
        class="input input--small input--transparent w-full truncate -mx-2
        -my-sm"
        type="text"
        value={color.name}
        on:change={(e) => updateName(e.target.value)}
      />
    </div>
    <div class="flex-shrink">
      <button on:click={removeSelf}>
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
        <button on:click={() => handleClickShade(i)}>
          <ColorBox {color} />
        </button>
      </li>
    {/each}
  </ol>
</div>
