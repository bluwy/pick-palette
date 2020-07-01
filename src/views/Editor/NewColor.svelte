<script>
  import chroma from 'chroma-js'
  import { dispatch } from '@/store/state'
  import { currentEditorView, editorViews } from '@/store/editor'
  import {
    getDefaultColorName,
    genShadeFunctions,
    supportedShadeCount
  } from '@/utils/app'
  import Button from '@/components/base/Button.svelte'
  import ButtonColor from '@/components/base/ButtonColor.svelte'
  import InputColor from '@/components/base/InputColor.svelte'
  import SelectToolbar from '@/components/base/SelectToolbar.svelte'
  import SelectColorDeficiency from '@/components/SelectColorDeficiency.svelte'

  const shadeChoices = supportedShadeCount.map((v) => ({ label: v, value: v }))

  let baseColor = chroma.random().hex()
  let shadeCount = 9

  $: shadeIdeas = genShadeFunctions.map((v) => ({
    name: v.name,
    shades: v.fn(baseColor, shadeCount)
  }))

  function create(shades) {
    dispatch((state) => {
      const currentProject = state.projects[state.selected]

      currentProject.colors.push({
        name: getDefaultColorName(currentProject),
        shades
      })
    })

    // Open color edit view
    $currentEditorView = editorViews.editColor
  }
</script>

<div class="text-center mb-2">
  <div class="text-lg mb-3">Pick a new color</div>
  <InputColor bind:value={baseColor} />
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
      transition-colors duration-200 hover:bg-opacity-20"
    >
      <div class="flex-shrink text-sm truncate w-48 opacity-70 mr-2">
        {idea.name}
      </div>
      <div class="flex-shrink space-x-2">
        {#each idea.shades as shade}
          <ButtonColor color={shade} />
        {/each}
      </div>
      <div class="flex-grow text-right">
        <Button small on:click={() => create(idea.shades)}>Choose</Button>
      </div>
    </div>
  {/each}
</div>
