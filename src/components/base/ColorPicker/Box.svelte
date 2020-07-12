<script>
  import chroma from 'chroma-js'
  import { createEventDispatcher } from 'svelte'
  import { slidable } from '/@/actions/slidable'
  import { hueGradient } from '/@/utils/app'
  import { clamp, throttle } from '/@/utils/common'

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

  // Pointer coordinates are normaized and origin at bottom-left corner
  let pointerX = 0
  let pointerY = 0
  let bgStyle = ''
  let slideHandler

  $: switch (mode) {
    case 'r':
      pointerX = g / 255
      pointerY = b / 255
      bgStyle = `
        linear-gradient(to top, transparent, blue),
        linear-gradient(to right, ${chroma(r, 0, 0).hex()}, green)
      `
      slideHandler = (x, y) => {
        dispatch('update', { type: 'g', value: x * 255 })
        dispatch('update', { type: 'b', value: y * 255 })
      }
      break
    case 'g':
      pointerX = r / 255
      pointerY = b / 255
      bgStyle = `
        linear-gradient(to top, transparent, blue),
        linear-gradient(to right, ${chroma(0, g, 0).hex()}, red)
      `
      slideHandler = (x, y) => {
        dispatch('update', { type: 'r', value: x * 255 })
        dispatch('update', { type: 'b', value: y * 255 })
      }
      break
    case 'b':
      pointerX = r / 255
      pointerY = g / 255
      bgStyle = `
        linear-gradient(to top, transparent, green),
        linear-gradient(to right, ${chroma(0, 0, b).hex()}, red)
      `
      slideHandler = (x, y) => {
        dispatch('update', { type: 'r', value: x * 255 })
        dispatch('update', { type: 'g', value: y * 255 })
      }
      break
    case 'h':
      pointerX = s
      pointerY = v
      bgStyle = `
        linear-gradient(to top, black, transparent),
        linear-gradient(to right, transparent, ${chroma.hsv(h, 1, 1).hex()})
      `
      slideHandler = (x, y) => {
        dispatch('update', { type: 's', value: x })
        dispatch('update', { type: 'v', value: y })
      }
      break
    case 's':
      pointerX = h / 360
      pointerY = v
      bgStyle = `
        linear-gradient(to top, black, transparent),
        linear-gradient(to right, ${hueGradient.join(', ')})
      `
      slideHandler = (x, y) => {
        dispatch('update', { type: 'h', value: x * 360 })
        dispatch('update', { type: 'v', value: y })
      }
      break
    case 'v':
      pointerX = h / 360
      pointerY = s
      bgStyle = `
        linear-gradient(to top, white, transparent),
        linear-gradient(to right, ${hueGradient.join(', ')})
      `
      slideHandler = (x, y) => {
        dispatch('update', { type: 'h', value: x * 360 })
        dispatch('update', { type: 's', value: y })
      }
      break
  }

  const handleSlide = throttle((e) => {
    const rect = e.target.getBoundingClientRect()
    const xValue = clamp((e.clientX - rect.left) / rect.width, 0, 1)
    const yValue = 1 - clamp((e.clientY - rect.top) / rect.height, 0, 1)
    slideHandler(xValue, yValue)
  }, 30)
</script>

<div
  class="relative w-full h-full cursor-crosshair"
  style="background-image: {bgStyle};"
  use:slidable
  on:slide|preventDefault={handleSlide}
>
  <div
    class="pointer absolute w-4 h-4 rounded-full cursor-pointer transform
    -translate-x-1/2 translate-y-1/2"
    style="left: {pointerX * 100}%; bottom: {pointerY * 100}%;"
  />
</div>

<style>
  .pointer {
    box-shadow: inset 0 0 0 1px white, 0 0 0 1px black;
  }
</style>
