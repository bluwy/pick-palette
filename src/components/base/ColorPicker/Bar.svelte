<script>
  import chroma from 'chroma-js'
  import { createEventDispatcher } from 'svelte'
  import slidable from '@/actions/slidable'
  import { hueGradient } from '@/utils/app'
  import { clamp, throttle } from '@/utils/common'

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

  // Pointer coordinate is normaized
  let pointerX = 0
  let bgStyle = ''
  let slideHandler

  $: switch (mode) {
    case 'r':
      pointerX = r / 255
      bgStyle = `linear-gradient(to right, black, red)`
      slideHandler = (x) => {
        dispatch('update', { type: 'r', value: x * 255 })
      }
      break
    case 'g':
      pointerX = g / 255
      bgStyle = `linear-gradient(to right, black, green)`
      slideHandler = (x) => {
        dispatch('update', { type: 'g', value: x * 255 })
      }
      break
    case 'b':
      pointerX = b / 255
      bgStyle = `linear-gradient(to right, black, blue)`
      slideHandler = (x) => {
        dispatch('update', { type: 'b', value: x * 255 })
      }
      break
    case 'h':
      pointerX = h / 360
      bgStyle = `linear-gradient(to right, ${hueGradient.join(', ')})`
      slideHandler = (x) => {
        dispatch('update', { type: 'h', value: x * 360 })
      }
      break
    case 's':
      pointerX = s
      bgStyle = `linear-gradient(to right, black, white)`
      slideHandler = (x) => {
        dispatch('update', { type: 's', value: x })
      }
      break
    case 'v':
      pointerX = v
      bgStyle = `linear-gradient(to right, black, white)`
      slideHandler = (x) => {
        dispatch('update', { type: 'v', value: x })
      }
      break
  }

  const handleSlide = throttle((e) => {
    const rect = e.target.getBoundingClientRect()
    const xValue = clamp((e.clientX - rect.left) / rect.width, 0, 1)
    slideHandler(xValue)
  }, 30)
</script>

<div
  class="relative h-3 cursor-crosshair flex-grow"
  style="background-image: {bgStyle};"
  use:slidable
  on:slide={handleSlide}
>
  <div
    class="pointer absolute h-full top-0 bg-gray-800"
    style="left: {pointerX * 100}%;"
  />
</div>

<style>
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
