<script>
  import { createEventDispatcher } from 'svelte'
  import Button from '../components/base/Button.svelte'

  const dispatch = createEventDispatcher()
</script>

<div class="text-center">
  <h1 class="text-xl mb-10">Choose how to create your new color</h1>
  <Button on:click={dispatch('smartcreate')}>Smart create</Button>
  <p class="mt-2 opacity-70">
    Give us a few colors and we will generate all the shades!
  </p>
  <p class="my-4 opacity-50">or</p>
  <Button on:click={dispatch('manualcreate')}>Manual create</Button>
  <p class="mt-2 opacity-70">
    Start with empty shades and manually add colors.
  </p>
</div>
