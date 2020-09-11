<script>
  import { createEventDispatcher } from 'svelte'
  import chroma from 'chroma-js'
  import { slidable } from '/@/actions/slidable'
  import { breakpointSm } from '/@/store/breakpoint'
  import { hueGradient } from '/@/utils/app'
  import { clamp, throttle } from '/@/utils/common'
  import type { Color } from 'chroma-js'
  import type { PickMode } from './types'

  // Two-way bind
  export let mode: PickMode

  // Readonly
  export let r: number
  export let g: number
  export let b: number
  export let h: number
  export let s: number
  export let v: number

  const dispatch = createEventDispatcher()

  let color: Color
  $: color = chroma.hsv(h, s, v)

  $: inputs = [
    {
      type: 'r',
      pointerX: r / 255,
      // prettier-ignore
      bgStyle: $breakpointSm ? `linear-gradient(to right, ${color.set('rgb.r', 0).hex()}, ${color.set('rgb.r', 255).hex()})` : '',
      value: Math.round(r),
      min: 0,
      max: 255,
      onInput: (v: number) => dispatch('update', { type: 'r', value: v }),
      slideHandler: (x: number) =>
        dispatch('update', { type: 'r', value: x * 255 })
    },
    {
      type: 'g',
      pointerX: g / 255,
      // prettier-ignore
      bgStyle: $breakpointSm ? `linear-gradient(to right, ${color.set('rgb.g', 0).hex()}, ${color.set('rgb.g', 255).hex()})` : '',
      value: Math.round(g),
      min: 0,
      max: 255,
      onInput: (v: number) => dispatch('update', { type: 'g', value: v }),
      slideHandler: (x: number) =>
        dispatch('update', { type: 'g', value: x * 255 })
    },
    {
      type: 'b',
      pointerX: b / 255,
      // prettier-ignore
      bgStyle: $breakpointSm ? `linear-gradient(to right, ${color.set('rgb.b', 0).hex()}, ${color.set('rgb.b', 255).hex()})` : '',
      value: Math.round(b),
      min: 0,
      max: 255,
      onInput: (v: number) => dispatch('update', { type: 'b', value: v }),
      slideHandler: (x: number) =>
        dispatch('update', { type: 'b', value: x * 255 })
    },
    {
      type: 'h',
      pointerX: h / 360,
      // prettier-ignore
      bgStyle: $breakpointSm ? `
        linear-gradient(to right, rgba(255, 255, 255, ${(1 - s)}), rgba(255, 255, 255, ${(1 - s)})),
        linear-gradient(to right, ${hueGradient.join(', ')})
      ` : '',
      value: Math.round(h),
      min: 0,
      max: 360,
      onInput: (v: number) => dispatch('update', { type: 'h', value: v }),
      slideHandler: (x: number) =>
        dispatch('update', { type: 'h', value: x * 360 })
    },
    {
      type: 's',
      pointerX: s,
      // prettier-ignore
      bgStyle: $breakpointSm ? `linear-gradient(to right, ${color.set('hsv.s', 0).hex()}, ${color.set('hsv.s', 1).hex()})` : '',
      value: Math.round(s * 100),
      min: 0,
      max: 100,
      onInput: (v: number) => dispatch('update', { type: 's', value: v / 100 }),
      slideHandler: (x: number) => dispatch('update', { type: 's', value: x })
    },
    {
      type: 'v',
      pointerX: v,
      // prettier-ignore
      bgStyle: $breakpointSm ? `linear-gradient(to right, ${color.set('hsv.v', 0).hex()}, ${color.set('hsv.v', 1).hex()})` : '',
      value: Math.round(v * 100),
      min: 0,
      max: 100,
      onInput: (v: number) => dispatch('update', { type: 'v', value: v / 100 }),
      slideHandler: (x: number) => dispatch('update', { type: 'v', value: x })
    }
  ]

  const handleSlide = throttle((e, handler) => {
    const rect = e.target.getBoundingClientRect()
    const xValue = clamp((e.detail.clientX - rect.left) / rect.width, 0, 1)
    handler(xValue)
  }, 30)

  function handleHexInput(e: Event) {
    dispatch('update', {
      type: 'hex',
      value: (e.target as HTMLInputElement).value
    })
  }
</script>

<div class="inputs-grid items-center pl-2">
  {#each inputs as input (input.type)}
    <input
      id="cp-{input.type}"
      class="col-auto"
      type="radio"
      bind:group={mode}
      value={input.type}
    />
    <label class="col-auto" for="cp-{input.type}">
      {input.type.toUpperCase()}
    </label>
    <div
      use:slidable
      class="hidden sm:block relative w-20 h-3 cursor-crosshair"
      style="background-image: {input.bgStyle};"
      on:slide={(e) => handleSlide(e, input.slideHandler)}
      on:mousedown|preventDefault
    >
      <div
        class="pointer absolute h-full top-0 bg-gray-800"
        style="left: {input.pointerX * 100}%;"
      />
    </div>
    <input
      class="input input--small"
      type="number"
      size={3}
      value={input.value}
      min={input.min}
      max={input.max}
      on:input={(e) => input.onInput(+e.target.value)}
    />
  {/each}

  <div class="col-span-2 sm:col-span-3 mt-2 flex justify-end items-center">
    <label
      for="cp-hex"
      class="inline-block w-6 h-6 border border-gray-300 rounded-full"
      style="background-color: {color.hex()};"
    />
  </div>
  <input
    id="cp-hex"
    class="input input--small mt-2"
    type="text"
    size={3}
    value={color.hex()}
    on:input={handleHexInput}
  />
</div>

<style lang="postcss">
  .inputs-grid {
    display: grid;
    grid-template-columns: repeat(3, auto);
    gap: 0.3rem;
  }

  @screen sm {
    .inputs-grid {
      grid-template-columns: repeat(4, auto);
      gap: 0.5rem;
    }
  }

  .pointer::before,
  .pointer::after {
    content: '';
    position: absolute;
    bottom: 100%;
    width: 2px;
    height: 4px;
    transform: translateX(-50%);
    background-color: currentColor;
  }

  .pointer::after {
    top: 100%;
  }
</style>
