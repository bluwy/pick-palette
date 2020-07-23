<script>
  import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
  import { faGripVertical } from '@fortawesome/free-solid-svg-icons'
  import { createEventDispatcher } from 'svelte'
  import Icon from 'svelte-fa'
  import { useLocation, useNavigate } from 'svelte-navigator'
  import {
    currentProject,
    removeColor,
    updateColorName
  } from '/@/store/project'
  import ColorBox from '/@/components/base/ColorBox.svelte'
  import EditableText from '/@/components/base/EditableText.svelte'

  export let colorId: string

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = createEventDispatcher()

  // Maybe be undefined if deleted
  $: color = $currentProject.colors.find((v) => v.id === colorId)

  $: shades = color?.shades ?? []

  function handleClickShade(shadeIndex) {
    // This is very hacky, though in the future I might switch router where
    // I can directly access route info.
    const isEditView = /project\/[^\/]*\/edit\//.test($location.pathname)
    // If editing, we can just replace the link
    navigate(`edit/${colorId}/${shadeIndex}`, { replace: isEditView })
  }

  function handleNameChange(e: Event) {
    updateColorName(colorId, (e.target as HTMLInputElement).value)
  }
</script>

<div class="px-3 py-2">
  <div class="flex flex-row justify-between mb-2">
    <div class="flex-grow text-sm truncate">
      <EditableText
        class="w-full"
        value={color.name}
        on:change={handleNameChange}
      />
    </div>
    <div class="flex-shrink">
      <button on:click={() => removeColor(colorId)}>
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
