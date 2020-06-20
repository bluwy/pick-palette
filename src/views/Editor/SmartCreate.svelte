<script>
  import { fade, fly } from 'svelte/transition'
  import Button from '@/components/base/Button.svelte'
  import Stepper from '@/components/base/Stepper.svelte'
  import InputSmartColor from '@/components/InputSmartColor.svelte'

  let lightestShade = ''
  let lighterShade = ''
  let baseShade = ''
  let darkerShade = ''
  let darkestShade = ''

  const steps = 3
  let currentStep = 0

  const prevStep = () => currentStep > 0 && currentStep--
  const nextStep = () => currentStep < steps && currentStep++
</script>

<style>
  .input-smart-color {
    opacity: 1;
    visibility: visible;
    transition: opacity 0.2s ease-out, visibility 0.2s;
  }

  .input-smart-color.hide {
    opacity: 0;
    visibility: hidden;
  }
</style>

<Stepper bind:currentStep {steps} />

<div
  class="relative h-24 flex flex-row justify-center items-center text-lg
  opacity-70"
>
  {#if currentStep === 0}
    <span in:fly={{ delay: 200, y: 5 }} out:fly={{ y: 5 }} class="absolute">
      Step 1: Pick a
      <strong>base</strong>
      shade
    </span>
  {:else if currentStep === 1}
    <span in:fly={{ delay: 200, y: 5 }} out:fly={{ y: 5 }} class="absolute">
      Step 2: Pick the
      <strong>lightest</strong>
      and
      <strong>darkest</strong>
      shades
    </span>
  {:else if currentStep >= 2}
    <span in:fly={{ delay: 200, y: 5 }} out:fly={{ y: 5 }} class="absolute">
      Step 3: Pick something in
      <strong>between</strong>
    </span>
  {/if}
</div>

<div class="flex flex-row justify-between mx-2 sm:mx-6 md:mx-10 lg:mx-14">
  <div class="input-smart-color" class:hide={currentStep < 1}>
    <InputSmartColor
      bind:value={lightestShade}
      label="Lightest"
      highlight={currentStep === 1}
    />
  </div>
  <div class="input-smart-color" class:hide={currentStep < 2}>
    <InputSmartColor
      bind:value={lighterShade}
      label="Lighter"
      highlight={currentStep === 2}
    />
  </div>
  <div>
    <InputSmartColor
      bind:value={baseShade}
      label="Base"
      highlight={currentStep === 0}
    />
  </div>
  <div class="input-smart-color" class:hide={currentStep < 2}>
    <InputSmartColor
      bind:value={darkerShade}
      label="Darker"
      highlight={currentStep === 2}
    />
  </div>
  <div class="input-smart-color" class:hide={currentStep < 1}>
    <InputSmartColor
      bind:value={darkestShade}
      label="Darkest"
      highlight={currentStep === 1}
    />
  </div>
</div>

<div class="text-center my-16">
  {#if currentStep > 0}
    <Button outline on:click={prevStep}>Back</Button>
  {/if}
  <Button on:click={nextStep}>
    {currentStep < steps - 1 ? 'Next' : 'Create'}
  </Button>
</div>
