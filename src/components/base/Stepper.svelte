<script>
  import { faCheck } from '@fortawesome/free-solid-svg-icons'
  import { scale } from 'svelte/transition'
  import Icon from 'svelte-fa'
  import { clamp } from '/@/utils/common'

  export let steps
  export let currentStep = 0

  let fillRatio: number
  $: fillRatio = clamp(currentStep / (steps - 1), 0, 1)
</script>

<div class="stepper relative">
  <div
    class="base-fill absolute -z-10 w-full h-2 my-2 rounded-full bg-gray-300
    opacity-50"
  />
  <div
    class="color-fill absolute -z-10 h-2 my-2 rounded-full bg-primary-500
    transition-all duration-200"
    style="width: {fillRatio * 100}%;"
  />
  <div class="flex flex-row justify-between">
    {#each Array(steps) as _, i (i)}
      <div
        class="flex justify-center items-center w-6 h-6 rounded-full text-center
        transition-colors duration-200 {i <= currentStep ? 'bg-primary-500 delay-100' : 'bg-gray-300'}"
      >
        <div>
          {#if i === currentStep}
            <div
              transition:scale
              class="absolute w-3 h-3 rounded-full bg-gray-100 transform
              -translate-x-1/2 -translate-y-1/2"
            />
          {:else}
            <div
              transition:scale
              class="absolute text-gray-300 text-xs transform -translate-x-1/2
              -translate-y-1/2"
            >
              <Icon icon={faCheck} />
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>
