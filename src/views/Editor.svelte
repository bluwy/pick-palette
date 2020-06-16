<script>
  import { state } from '../store/state'
  import { currentEditorView, editorViews } from '../store/editor'
  import EditorEditColor from './EditorEditColor.svelte'
  import EditorNewColor from './EditorNewColor.svelte'
  import EditorSmartCreate from './EditorSmartCreate.svelte'
  import Button from '../components/base/Button.svelte'
  import TheHeader from '../components/TheHeader.svelte'
  import ColorTab from '../components/ColorTab.svelte'

  const editorViewMap = Object.freeze({
    // TODO: Add default empty view
    [editorViews.empty]: undefined,
    [editorViews.editColor]: EditorEditColor,
    [editorViews.newColor]: EditorNewColor,
    [editorViews.smartCreate]: EditorSmartCreate
  })

  $: project = $state.projects[$state.selected]
</script>

<div class="h-full flex flex-col">
  <TheHeader />
  <div class="container flex-grow">
    <div class="h-full py-6 flex flex-col md:flex-row">
      <div class="w-full h-full md:w-1/3 pb-3 md:pb-0 md:pr-6">
        <div class="opacity-70 mb-5">Palette</div>
        <div class="flex flex-col">
          {#if project.colors.length <= 0}
            <div class="text-center">
              <p class="text-sm opacity-50 my-6">No colors yet</p>
            </div>
          {:else}
            <ul>
              {#each project.colors as color}
                <li class="mb-4">
                  <ColorTab {...color} />
                </li>
              {/each}
            </ul>
          {/if}
        </div>
        <Button
          outline
          on:click={() => ($currentEditorView = editorViews.newColor)}
        >
          Add color
        </Button>
      </div>
      <div
        class="w-full h-full md:w-2/3 pt-3 md:pt-0 md:pl-6 border-t
        border-gray-500 border-opacity-50 md:border-t-0 border-l"
      >
        <div class="opacity-70 mb-5">Editor</div>
        <svelte:component this={editorViewMap[$currentEditorView]} />
      </div>
    </div>
  </div>
</div>
