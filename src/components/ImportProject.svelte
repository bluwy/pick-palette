<script lang="ts">
  import Icon from 'svelte-fa'
  import { navigate } from '@bjornlu/svelte-router'
  import { faTimes } from '@fortawesome/free-solid-svg-icons'
  import { dragOnce } from '@/actions/drag-once'
  import { shortcut } from '@/actions/shortcut'
  import { importProject } from '@/store/projects'
  import FullscreenBackdrop from './base/FullscreenBackdrop.svelte'
  import type { SetupFunction } from '@/actions/shortcut'

  export let show = false

  let isDragTriggered = false
  let isFileHover = false
  let files: FileList

  $: if (files && files[0]) {
    const reader = new FileReader()

    reader.onload = (e) => {
      const text = e.target?.result as string
      const projectId = importProject(JSON.parse(text))
      navigate(`/project/${projectId}`)
    }

    reader.readAsText(files[0])
  }

  // Make sure if not showing, isDragTriggered should also be false
  $: if (!show) {
    isDragTriggered = false
  }

  function handleDragEnter() {
    if (!show) {
      isDragTriggered = true
      show = true
    }
  }

  function handleDragLeave() {
    if (isDragTriggered) {
      show = false
      isDragTriggered = false
    }
  }

  const setupShortcuts: SetupFunction = (on) => {
    on('esc', () => (show = false))
  }
</script>

<svelte:window
  use:dragOnce
  use:shortcut={setupShortcuts}
  on:dragenteronce={handleDragEnter}
  on:dragleaveonce={handleDragLeave}
/>

{#if show}
  <FullscreenBackdrop>
    <div
      class="flex flex-col justify-center items-center text-center px-5 py-10
        w-full max-w-2xl h-full text-primary-100"
    >
      <div class="flex-shrink text-2xl font-light">Import Project</div>
      <label
        class="label-style flex-grow relative w-full h-full my-5"
        class:label-style--hover={isFileHover}
      >
        <div
          class="flex flex-col justify-center items-center p-5 h-full font-bold"
        >
          <p>Drag project file here</p>
          {#if !isDragTriggered}
            <p class="my-3 text-sm opacity-60">or</p>
            <p>Browse files</p>
          {/if}
        </div>
        <input
          use:dragOnce
          class="absolute top-0 left-0 w-full h-full opacity-0"
          type="file"
          bind:files
          on:dragenteronce={() => (isFileHover = true)}
          on:dragleaveonce={() => (isFileHover = false)}
        />
      </label>
      <button class="flex-shrink" on:click={() => (show = false)}>
        <Icon class="mr-2" icon={faTimes} />
        Close
      </button>
    </div>
  </FullscreenBackdrop>
{/if}

<style lang="postcss">
  .label-style {
    @apply text-lg rounded-lg border-4 border-dashed border-primary-100 text-primary-100 transition-colors duration-200;
    max-height: 20rem;
  }

  .label-style:hover,
  .label-style--hover {
    @apply border-primary-300 text-primary-300;
  }
</style>
