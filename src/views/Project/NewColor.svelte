<script>
  import chroma from 'chroma-js'
  import { nanoid } from 'nanoid/non-secure'
  import { navigateTo } from 'svelte-router-spa'
  import { state } from '@/store/state'
  import {
    getDefaultColorName,
    genShadeFunctions,
    supportedShadeCount
  } from '@/utils/app'
  import ColorBox from '@/components/base/ColorBox.svelte'
  import ColorPicker from '@/components/base/ColorPicker/Index.svelte'
  import SelectToolbar from '@/components/base/SelectToolbar.svelte'

  export let currentRoute

  const shadeChoices = supportedShadeCount.map((v) => ({ label: v, value: v }))

  let baseColor = chroma.random().hex()
  let shadeCount = 9

  $: projectId = currentRoute.namedParams.projectid

  $: shadeIdeas = genShadeFunctions.map((v) => ({
    name: v.name,
    shades: v.fn(baseColor, shadeCount)
  }))

  function create(shades) {
    const colorId = nanoid(6)

    state.update('Create new color', (state) => {
      const currentProject = state.projects.find((v) => v.id === projectId)

      currentProject.colors.push({
        id: colorId,
        name: getDefaultColorName(currentProject),
        shades
      })
    })

    // Open color edit view
    navigateTo(`project/${projectId}/edit/${colorId}`)
  }
</script>

<div class="text-center mb-2">
  <div class="text-lg mb-3">Pick a color</div>
  <div class="inline-block">
    <ColorPicker bind:value={baseColor} />
  </div>
</div>

<div class="flex justify-between items-center mb-1">
  <div>Ideas</div>
  <div class="flex items-center">
    <label class="mr-3">Shade</label>
    <SelectToolbar bind:value={shadeCount} choices={shadeChoices} />
  </div>
</div>

<div class="space-y-1 overflow-y-auto">
  {#each shadeIdeas as idea}
    <div
      class="flex items-center p-2 bg-gray-500 bg-opacity-0 rounded
      transition-colors duration-200 hover:bg-opacity-10"
    >
      <div class="flex-shrink text-sm truncate w-48 opacity-70 mr-2">
        {idea.name}
      </div>
      <div class="flex-shrink space-x-2">
        {#each idea.shades as shade}
          <ColorBox color={shade} />
        {/each}
      </div>
      <div class="flex-grow text-right">
        <button class="button--small" on:click={() => create(idea.shades)}>
          Choose
        </button>
      </div>
    </div>
  {/each}
</div>
