<script>
  import type { Deficiency } from '@bjornlu/colorblind'
  import { colorDeficiency } from '/@/store/colorblind'
  import Select from './base/Select.svelte'

  export let value: Deficiency | undefined = $colorDeficiency

  const choices: { label: string; value: Deficiency | undefined }[] = [
    { label: 'Normal', value: undefined },
    { label: 'Protanopia', value: 'protanopia' },
    { label: 'Deuteranopia', value: 'deuteranopia' },
    { label: 'Tritanopia', value: 'tritanopia' },
    { label: 'Achromatopsia', value: 'achromatopsia' }
  ]

  $: $colorDeficiency = value
</script>

<Select bind:value {choices} />
