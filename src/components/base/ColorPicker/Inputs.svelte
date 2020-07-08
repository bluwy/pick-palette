<script>
  import chroma from 'chroma-js'
  import { createEventDispatcher } from 'svelte'
  import { slidable } from '@/actions/slidable'
  import { hueGradient } from '@/utils/app'
  import { clamp, throttle } from '@/utils/common'

  // Two-way bind
  /** @type {'r'|'g'|'b'|'h'|'s'|'v'}  */
  export let mode

  // Readonly
  export let r
  export let g
  export let b
  export let h
  export let s
  export let v

  const dispatch = createEventDispatcher()

  $: color = chroma.hsv(h, s, v)

  $: inputs = [
    {
      type: 'r',
      pointerX: r / 255,
      // prettier-ignore
      bgStyle: `linear-gradient(to right, ${color.set('rgb.r', 0).hex()}, ${color.set('rgb.r', 255).hex()})`,
      value: Math.round(r),
      min: 0,
      max: 255,
      onInput: (v) => dispatch('update', { type: 'r', value: v }),
      slideHandler: (x) => dispatch('update', { type: 'r', value: x * 255 })
    },
    {
      type: 'g',
      pointerX: g / 255,
      // prettier-ignore
      bgStyle: `linear-gradient(to right, ${color.set('rgb.g', 0).hex()}, ${color.set('rgb.g', 255).hex()})`,
      value: Math.round(g),
      min: 0,
      max: 255,
      onInput: (v) => dispatch('update', { type: 'g', value: v }),
      slideHandler: (x) => dispatch('update', { type: 'g', value: x * 255 })
    },
    {
      type: 'b',
      pointerX: b / 255,
      // prettier-ignore
      bgStyle: `linear-gradient(to right, ${color.set('rgb.b', 0).hex()}, ${color.set('rgb.b', 255).hex()})`,
      value: Math.round(b),
      min: 0,
      max: 255,
      onInput: (v) => dispatch('update', { type: 'b', value: v }),
      slideHandler: (x) => dispatch('update', { type: 'b', value: x * 255 })
    },
    {
      type: 'h',
      pointerX: h / 360,
      // prettier-ignore
      bgStyle: `linear-gradient(to right, ${hueGradient.join(', ')})`,
      value: Math.round(h),
      min: 0,
      max: 360,
      onInput: (v) => dispatch('update', { type: 'h', value: v }),
      slideHandler: (x) => dispatch('update', { type: 'h', value: x * 360 })
    },
    {
      type: 's',
      pointerX: s,
      // prettier-ignore
      bgStyle: `linear-gradient(to right, ${color.set('hsv.s', 0).hex()}, ${color.set('hsv.s', 1).hex()})`,
      value: Math.round(s * 100),
      min: 0,
      max: 100,
      onInput: (v) => dispatch('update', { type: 's', value: v / 100 }),
      slideHandler: (x) => dispatch('update', { type: 's', value: x })
    },
    {
      type: 'v',
      pointerX: v,
      // prettier-ignore
      bgStyle: `linear-gradient(to right, ${color.set('hsv.v', 0).hex()}, ${color.set('hsv.v', 1).hex()})`,
      value: Math.round(v * 100),
      min: 0,
      max: 100,
      onInput: (v) => dispatch('update', { type: 'v', value: v / 100 }),
      slideHandler: (x) => dispatch('update', { type: 'v', value: x })
    }
  ]

  const handleSlide = throttle((e, handler) => {
    const rect = e.target.getBoundingClientRect()
    const xValue = clamp((e.clientX - rect.left) / rect.width, 0, 1)
    handler(xValue)
  }, 30)
</script>

<div class="inputs-grid items-center pl-2">
  {#each inputs as input (input.type)}
    <div>
      <input
        id="cp-{input.type}"
        class="col-auto"
        type="radio"
        bind:group={mode}
        value={input.type}
      />
    </div>
    <label class="col-auto" for="cp-{input.type}">
      {input.type.toUpperCase()}
    </label>
    <div
      class="relative w-20 h-3 cursor-crosshair"
      style="background-image: {input.bgStyle};"
      use:slidable
      on:slide={(e) => handleSlide(e, input.slideHandler)}
      on:mousedown|preventDefault
    >
      <div
        class="pointer absolute h-full top-0 bg-gray-800"
        style="left: {input.pointerX * 100}%;"
      />
    </div>
    <input
      class="input--small"
      type="number"
      size="4"
      value={input.value}
      min={input.min}
      max={input.max}
      on:input={(e) => input.onInput(e.target.value)}
    />
  {/each}

  <label for="cp-hex" class="col-start-3 text-right mt-2">#</label>
  <input
    id="cp-hex"
    class="input--small mt-2"
    type="text"
    size="4"
    value={color.hex().slice(1)}
    on:input={(e) => dispatch('update', {
        type: 'hex',
        value: '#' + e.target.value
      })}
  />
</div>

<style>
  .inputs-grid {
    display: grid;
    grid-template-columns: repeat(4, auto);
    gap: 0.5rem;
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
