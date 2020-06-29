<script>
  import { simulate } from '@bjornlu/colorblind'
  import Select from './base/Select.svelte'

  export let value
  export let props = {}

  const choices = [
    {
      label: 'None',
      value: ''
    },
    {
      label: 'Protanopia',
      value: 'protanopia'
    },
    {
      label: 'Deuteranopia',
      value: 'deuteranopia'
    },
    {
      label: 'Tritanopia',
      value: 'tritanopia'
    },
    {
      label: 'Achromatopsia',
      value: 'achromatopsia'
    }
  ]
</script>

<Select bind:value {choices} {...props} />
