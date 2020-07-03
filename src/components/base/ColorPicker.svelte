<script>
  import chroma from 'chroma-js'
  import slidable from '@/actions/slidable'
  import { clamp, throttle } from '@/utils/common'

  export let value

  let [h, s, v] = chroma(value).hsv()

  // Chroma hue value might be NaN for grays
  if (Number.isNaN(h)) {
    h = 0
  }

  $: value = chroma.hsv(h, s, v).hex()
  $: hueColor = chroma.hsv(h, 1, 1).hex()

  const handleSatLightBox = throttle((e) => {
    const rect = e.target.getBoundingClientRect()
    const xRatio = clamp((e.clientX - rect.left) / rect.width, 0, 1)
    const yRatio = clamp((e.clientY - rect.top) / rect.height, 0, 1)

    s = xRatio
    v = 1 - yRatio
  }, 30)

  const handleHueBar = throttle((e) => {
    const rect = e.target.getBoundingClientRect()
    const xRatio = clamp((e.clientX - rect.left) / rect.width, 0, 1)

    h = xRatio * 360
  }, 30)
</script>

<div class="w-48" on:dragstart|preventDefault>
  <div
    class="relative w-48 h-48 cursor-crosshair"
    style="background-image: linear-gradient(transparent, black),
    linear-gradient(to right, white, {hueColor});"
    use:slidable
    on:slide|preventDefault={handleSatLightBox}
  >
    <div
      class="svbox-pointer absolute w-4 h-4 rounded-full cursor-pointer
      transform -translate-x-1/2 -translate-y-1/2"
      style="top: {(1 - v) * 100}%; left: {s * 100}%;"
    />
  </div>
  <div class="p-2 bg-white flex flex-row items-center">
    <div
      class="w-5 h-5 mr-2 rounded-full shadow-inner"
      style="background-color: {value};"
    />
    <div
      class="hue relative h-3 cursor-crosshair flex-grow"
      use:slidable
      on:slide={handleHueBar}
    >
      <div
        class="hbar-pointer absolute h-full top-0 bg-gray-800"
        style="left: {(h / 360) * 100}%;"
      />
    </div>
  </div>
</div>

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

  .svbox-pointer {
    box-shadow: inset 0 0 0 1px white, 0 0 0 1px black;
  }

  .hbar-pointer::before,
  .hbar-pointer::after {
    content: '';
    position: absolute;
    bottom: 100%;
    width: 2px;
    height: 4px;
    transform: translateX(-50%);
    background-color: currentColor;
  }

  .hbar-pointer::after {
    top: 100%;
  }
</style>
