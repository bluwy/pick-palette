<script>
  import chroma from 'chroma-js'

  import { dispatch } from '@/store/state'
  import { currentEditorView, editorViews } from '@/store/editor'
  import { getDefaultColorName, genShadeFunctions } from '@/utils/app'
  import Button from '@/components/base/Button.svelte'
  import ButtonColor from '@/components/base/ButtonColor.svelte'
  import InputColor from '@/components/base/InputColor.svelte'
  import SelectToolbar from '@/components/base/SelectToolbar.svelte'

  let baseColor = '#ffffff'
  let shadeCount = 9
  let shadeFunctionName = 'Luminance'
  let resultShades = []
  let correctLightness = true

  $: {
    const func = genShadeFunctions.find((v) => v.name === shadeFunctionName)

    if (func != null) {
      let shades = func.fn(baseColor, shadeCount)

      if (correctLightness) {
        shades = chroma.scale(shades).correctLightness().colors(shades.length)
      }

      resultShades = shades
    }
  }

  const shadeChoices = [5, 7, 9].map((v) => ({ label: v, value: v }))

  const shadeFunctionChoices = genShadeFunctions.map((v) => ({
    label: v.name,
    value: v.name
  }))

  function create() {
    dispatch((state) => {
      const currentProject = state.projects[state.selected]

      currentProject.colors.push({
        name: getDefaultColorName(currentProject),
        shades: resultShades
      })
    })

    // Open color edit view
    $currentEditorView = editorViews.editColor
  }
</script>

<div class="flex flex-row flex-wrap">
  <div class="w-full sm:w-1/2 md:w-1/3 mb-3">
    <label class="block mb-1">Base color</label>
    <InputColor bind:value={baseColor} />
  </div>
  <div class="w-full sm:w-1/2 md:w-1/3 mb-3">
    <label class="block mb-1">Shade count</label>
    <SelectToolbar bind:value={shadeCount} choices={shadeChoices} />
  </div>
  <div class="w-full md:w-1/3 mb-3">
    <label class="block mb-1">Shade algorithm</label>
    <SelectToolbar
      bind:value={shadeFunctionName}
      choices={shadeFunctionChoices}
    />
  </div>
  <div class="w-full mb-3">
    <label>
      <span>Correct lightness</span>
      <input type="checkbox" bind:checked={correctLightness} />
    </label>
  </div>
</div>

<div class="max-w-md mx-auto my-8 flex flex-row justify-between">
  {#each resultShades as shade}
    <ButtonColor color={shade} />
  {/each}
</div>

<div class="text-center">
  <Button on:click={create}>Create</Button>
</div>
