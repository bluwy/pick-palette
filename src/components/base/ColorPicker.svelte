<script>
  import chroma from 'chroma-js'
  import slidable from '@/actions/slidable'
  import { clamp, throttle } from '@/utils/common'

  export let value

  // Source of truth
  let [h, s, v] = chroma(value).hsv()

  // Chroma hue value might be NaN for grays
  if (Number.isNaN(h)) {
    h = 0
  }

  $: color = chroma.hsv(h, s, v)
  $: rgb = color.rgb()
  $: hex = color.hex()
  $: hueColor = chroma.hsv(h, 1, 1).hex()

  // Auto update value
  $: value = color.hex()

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

  function handleInputR(e) {
    ;[h, s, v] = color.set('rgb.r', e.target.value).hsv()
  }

  function handleInputG(e) {
    ;[h, s, v] = color.set('rgb.g', e.target.value).hsv()
  }

  function handleInputB(e) {
    ;[h, s, v] = color.set('rgb.b', e.target.value).hsv()
  }

  function handleInputH(e) {
    h = e.target.value
  }

  function handleInputS(e) {
    s = e.target.value / 100
  }

  function handleInputV(e) {
    v = e.target.value / 100
  }

  function handleInputHex(e) {
    if (chroma.valid(e.target.value)) {
      value = chroma(e.target.value).hex()
    }
  }
</script>

<div class="flex flex-row bg-white" on:dragstart|preventDefault>
  <div>
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
    <div class="p-2 flex flex-row items-center">
      <div
        class="w-5 h-5 mr-2 rounded-full shadow-inner"
        style="background-color: {hex};"
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
  <div>
    <div class="m-2 space-y-1">
      <label class="block">
        <span class="mr-2">R</span>
        <input
          class="input--small"
          type="number"
          value={Math.round(rgb[0])}
          min="0"
          max="255"
          size="4"
          on:input={handleInputR}
        />
      </label>
      <label class="block">
        <span class="mr-2">G</span>
        <input
          class="input--small"
          type="number"
          value={Math.round(rgb[1])}
          min="0"
          max="255"
          size="4"
          on:input={handleInputG}
        />
      </label>
      <label class="block">
        <span class="mr-2">B</span>
        <input
          class="input--small"
          type="number"
          value={Math.round(rgb[2])}
          min="0"
          max="255"
          size="4"
          on:input={handleInputB}
        />
      </label>
      <label class="block">
        <span class="mr-2">H</span>
        <input
          class="input--small"
          type="number"
          value={Math.round(h)}
          min="0"
          max="360"
          size="4"
          on:input={handleInputH}
        />
      </label>
      <label class="block">
        <span class="mr-2">S</span>
        <input
          class="input--small"
          type="number"
          value={Math.round(s * 100)}
          min="0"
          max="100"
          size="4"
          on:input={handleInputS}
        />
      </label>
      <label class="block">
        <span class="mr-2">V</span>
        <input
          class="input--small"
          type="number"
          value={Math.round(v * 100)}
          min="0"
          max="100"
          size="4"
          on:input={handleInputV}
        />
      </label>
      <label class="block">
        <span class="mr-2">#</span>
        <input
          class="input--small"
          type="text"
          value={color.hex().slice(1)}
          size="4"
          on:input={handleInputHex}
        />
      </label>
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
