<script>
  import { fade } from 'svelte/transition'
  import clickOutside from '@/actions/click-outside'
  import Popper from './Popper.svelte'

  export let text = ''

  let show
</script>

<div use:clickOutside on:clickoutside={() => (show = false)}>
  <Popper bind:show arrow options={{ placement: 'top' }}>
    <div slot="reference" on:click={() => (show = true)}>
      <slot name="reference" />
    </div>
    <div
      transition:fade={{ duration: 200 }}
      class="px-3 p-1 text-sm bg-gray-100 rounded shadow-md"
    >
      <slot close={() => (show = false)}>{text}</slot>
    </div>
  </Popper>
</div>
