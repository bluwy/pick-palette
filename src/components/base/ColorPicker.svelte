<script>
  import tc from 'tinycolor2'
  import { clamp, slidable, throttle } from '../../util'

  export let value

  const hsv = tc(value).toHsv()

  $: color = tc(value)
  $: hueColor = tc({ h: hsv.h, s: 1, v: 1 }).toHexString()
  $: value = tc(hsv).toHexString()

  const handleSatLightBox = throttle((e) => {
    const rect = e.target.getBoundingClientRect()
    const xRatio = clamp((e.clientX - rect.left) / rect.width, 0, 1)
    const yRatio = 1 - clamp((e.clientY - rect.top) / rect.height, 0, 1)

    hsv.s = xRatio
    hsv.v = yRatio
  }, 30)

  const handleHueBar = throttle((e) => {
    const rect = e.target.getBoundingClientRect()
    const xRatio = clamp((e.clientX - rect.left) / rect.width, 0, 1)

    hsv.h = xRatio * 360
  }, 30)
</script>

<style>
  .hue {
    background-image: linear-gradient(
      to right,
      #ff0000,
      #ffff00,
      #00ff00,
      #00ffff,
      #0000ff,
      #ff00ff,
      #ff0000
    );
  }

  .pointer {
    box-shadow: inset 0 0 0 1px white, 0 0 0 1px black;
  }
</style>

<div class="w-48">
  <div
    class="relative w-48 h-48"
    style="background-image: linear-gradient(transparent, black),
    linear-gradient(to right, white, {hueColor});"
    use:slidable
    on:slide|preventDefault={handleSatLightBox}
  >
    <div
      class="pointer absolute w-4 h-4 rounded-full cursor-pointer transform
      -translate-x-1/2 -translate-y-1/2"
      style="top: {(1 - hsv.v) * 100}%; left: {hsv.s * 100}%;"
    />
  </div>
  <div class="p-2 flex flex-row items-center">
    <div
      class="w-5 h-5 mr-2 rounded-full shadow-inner"
      style="background-color: {color.toHexString()}"
    />
    <div
      class="hue h-3 rounded-full flex-grow"
      use:slidable
      on:slide={handleHueBar}
    />
  </div>
</div>
