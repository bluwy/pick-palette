<script>
  import { faTimes } from '@fortawesome/free-solid-svg-icons'
  import { fly } from 'svelte/transition'
  import { flip } from 'svelte/animate'
  import Icon from 'svelte-fa'
  import { snacks, removeSnack } from '/@/store/snackbar'

  // List of snack ids that have been setTimeout to close.
  // NOTE: Use const to prevent Svelte from making this reactive since this is
  // onlu used for internal id tracking
  const timeoutIds: string[] = []

  // Class for different snack types (for purgecss)
  const typeClass = {
    info: 'border-info-500 bg-info-100',
    success: 'border-success-500 bg-success-100',
    warning: 'border-warning-500 bg-warning-100',
    error: 'border-error-500 bg-error-100'
  }

  $: $snacks.forEach((snack) => {
    if (timeoutIds.includes(snack.id)) {
      return
    }

    if (snack.timeout > 0) {
      setTimeout(() => closeSnack(snack.id), snack.timeout)
    }

    timeoutIds.push(snack.id)
  })

  function closeSnack(id: string) {
    removeSnack(id)
    timeoutIds.splice(timeoutIds.indexOf(id))
  }
</script>

<div
  class="fixed flex flex-col justify-end bottom-0 right-0 p-3 w-full max-w-sm
    h-full pointer-events-none"
>
  <ul class="flip-y space-y-2">
    {#each $snacks as snack (snack.id)}
      <li
        transition:fly={{ x: 10, duration: 200 }}
        animate:flip={{ duration: 250 }}
        class="flip-y pointer-events-auto"
      >
        <div
          class="flex items-center px-3 py-2 border-2 rounded {typeClass[snack.type]}"
        >
          <div class="flex-grow">{snack.message}</div>
          <div>
            <button
              class="button--transparent text-black"
              on:click={() => closeSnack(snack.id)}
            >
              <Icon icon={faTimes} />
            </button>
          </div>
        </div>
      </li>
    {/each}
  </ul>
</div>

<style>
  .flip-y {
    transform: scaleY(-1);
  }
</style>
