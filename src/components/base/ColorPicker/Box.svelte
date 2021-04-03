<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import chroma from 'chroma-js'
  import { slidable } from '@/actions/slidable'
  import { hueGradient } from '@/utils/app'
  import { clamp, throttle } from '@/utils/common'
  import type { PickMode } from './types'

  export let mode: PickMode

  // Readonly
  export let r: number
  export let g: number
  export let b: number
  export let h: number
  export let s: number
  export let v: number

  const dispatch = createEventDispatcher()

  // Pointer coordinates are normaized and origin at bottom-left corner
  let pointerX = 0
  let pointerY = 0
  let bgStyle = ''
  let slideHandler: (x: number, y: number) => void

  $: switch (mode) {
    case 'r':
      pointerX = g / 255
      pointerY = b / 255
      // prettier-ignore
      bgStyle = `
        radial-gradient(ellipse at top left, ${chroma(r, 0, 255).hex()}, transparent 55%),
        radial-gradient(ellipse at top right, ${chroma(r, 255, 255).hex()}, transparent 55%),
        radial-gradient(ellipse at bottom left, ${chroma(r, 0, 0).hex()}, transparent 55%),
        radial-gradient(ellipse at bottom right, ${chroma(r, 255, 0).hex()}, transparent 55%)
      `
      slideHandler = (x: number, y: number) => {
        dispatch('update', { type: 'g', value: x * 255 })
        dispatch('update', { type: 'b', value: y * 255 })
      }
      break
    case 'g':
      pointerX = r / 255
      pointerY = b / 255
      // prettier-ignore
      bgStyle = `
        radial-gradient(ellipse at top left, ${chroma(0, g, 255).hex()}, transparent 55%),
        radial-gradient(ellipse at top right, ${chroma(255, g, 255).hex()}, transparent 55%),
        radial-gradient(ellipse at bottom left, ${chroma(0, g, 0).hex()}, transparent 55%),
        radial-gradient(ellipse at bottom right, ${chroma(255, g, 0).hex()}, transparent 55%)
      `
      slideHandler = (x: number, y: number) => {
        dispatch('update', { type: 'r', value: x * 255 })
        dispatch('update', { type: 'b', value: y * 255 })
      }
      break
    case 'b':
      pointerX = r / 255
      pointerY = g / 255
      // prettier-ignore
      bgStyle = `
        radial-gradient(ellipse at top left, ${chroma(0, 255, b).hex()}, transparent 55%),
        radial-gradient(ellipse at top right, ${chroma(255, 255, b).hex()}, transparent 55%),
        radial-gradient(ellipse at bottom left, ${chroma(0, 0, b).hex()}, transparent 55%),
        radial-gradient(ellipse at bottom right, ${chroma(255, 0, b).hex()}, transparent 55%)
      `
      slideHandler = (x: number, y: number) => {
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
      slideHandler = (x: number, y: number) => {
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
      slideHandler = (x: number, y: number) => {
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
      slideHandler = (x: number, y: number) => {
        dispatch('update', { type: 'h', value: x * 360 })
        dispatch('update', { type: 's', value: y })
      }
      break
  }

  const handleSlide = throttle((e) => {
    const rect = e.target.getBoundingClientRect()
    const xValue = clamp((e.detail.clientX - rect.left) / rect.width, 0, 1)
    const yValue = 1 - clamp((e.detail.clientY - rect.top) / rect.height, 0, 1)
    slideHandler(xValue, yValue)
  }, 30)
</script>

<div
  use:slidable
  class="box-blend relative w-full h-full cursor-crosshair"
  class:box-blend={mode === 'r' || mode === 'g' || mode === 'b'}
  style="background-image: {bgStyle};"
  on:slide|preventDefault={handleSlide}
>
  <div
    class="pointer absolute w-4 h-4 rounded-full cursor-pointer transform
      -translate-x-1/2 translate-y-1/2"
    style="left: {pointerX * 100}%; bottom: {pointerY * 100}%;"
  />
</div>

<style>
  .box-blend {
    background-blend-mode: lighten;
  }

  .pointer {
    box-shadow: inset 0 0 0 1px white, 0 0 0 1px black;
  }
</style>
