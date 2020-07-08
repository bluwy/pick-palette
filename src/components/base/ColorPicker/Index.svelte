<script>
  import chroma from 'chroma-js'
  import { createEventDispatcher } from 'svelte'
  import Bar from './Bar.svelte'
  import Box from './Box.svelte'
  import Inputs from './Inputs.svelte'

  export let value

  const dispatch = createEventDispatcher()

  let mode = 'h'

  // Source of truth
  let [h, s, v] = chroma(value).hsv()

  // Chroma hue value might be NaN for grays
  $: if (Number.isNaN(h)) {
    h = 0
  }

  $: [r, g, b] = chroma.hsv(h, s, v).rgb()

  function handleUpdate(e) {
    const { type, value } = e.detail

    switch (type) {
      case 'r':
        ;[h, s, v] = chroma.hsv(h, s, v).set('rgb.r', value).hsv()
        break
      case 'g':
        ;[h, s, v] = chroma.hsv(h, s, v).set('rgb.g', value).hsv()
        break
      case 'b':
        ;[h, s, v] = chroma.hsv(h, s, v).set('rgb.b', value).hsv()
        break
      case 'h':
        h = value
        break
      case 's':
        s = value
        break
      case 'v':
        v = value
        break
      case 'hex':
        if (chroma.valid(value)) {
          ;[h, s, v] = chroma(value).hsv()
        }
        break
    }

    updateValue()
  }

  function updateValue() {
    // Always use hex for value
    const hex = chroma({ h, s, v }).hex()
    // Update value for two-way binding
    value = hex
    // Emit input for event binding
    dispatch('input', hex)
  }

  export function reset() {
    ;[h, s, v] = chroma(value).hsv()
  }
</script>

<div class="flex p-2 border border-gray-500 rounded bg-white">
  <div>
    <div class="w-56 h-56" on:mousedown|preventDefault>
      <Box {mode} {r} {g} {b} {h} {s} {v} on:update={handleUpdate} />
    </div>
    <div class="pt-2" on:mousedown|preventDefault>
      <Bar {mode} {r} {g} {b} {h} {s} {v} on:update={handleUpdate} />
    </div>
  </div>
  <div>
    <Inputs bind:mode {r} {g} {b} {h} {s} {v} on:update={handleUpdate} />
  </div>
</div>
