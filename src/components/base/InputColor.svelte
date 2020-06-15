<script>
  import { fly } from 'svelte/transition'
  import clickOutside from '../../actions/click-outside'
  import Popper from './Popper.svelte'
  import ColorPicker from './ColorPicker.svelte'
  import InputText from './InputText.svelte'

  export let value

  let show
</script>

<div
  use:clickOutside
  class="inline-block"
  on:clickoutside={() => (show = false)}
>
  <Popper bind:show options={{ placement: 'bottom-start' }}>
    <div slot="reference" class="flex items-center">
      <button
        class="w-8 h-8 mr-2 rounded shadow-inner"
        style="background-color: {value}"
        on:click={() => (show = true)}
      />
      <InputText bind:value props={{ size: 8 }} />
    </div>
    <div
      transition:fly={{ y: 10, duration: 250 }}
      class="inline-block mt-2 shadow-lg"
    >
      <ColorPicker bind:value />
    </div>
  </Popper>
</div>
