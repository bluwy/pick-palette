<script>
  import { currentEditorView, editorViews } from '@/store/project'
  import ColorPanel from './Project/ColorPanel.svelte'
  import EditColor from './Project/EditColor.svelte'
  import Header from './Project/Header.svelte'
  import NewColor from './Project/NewColor.svelte'

  const editorViewMap = Object.freeze({
    // TODO: Add default empty view
    [editorViews.empty]: undefined,
    [editorViews.editColor]: EditColor,
    [editorViews.newColor]: NewColor
  })
</script>

<div class="h-full flex flex-col">
  <Header />
  <div class="container flex-grow overflow-y-auto">
    <div class="h-full py-6 flex flex-col md:flex-row">
      <div class="w-full h-full md:w-1/3 pb-3 md:pb-0 md:pr-6">
        <ColorPanel />
      </div>
      <div
        class="flex flex-col w-full h-full md:w-2/3 pt-3 md:pt-0 md:pl-6
        border-t border-gray-500 border-opacity-50 md:border-t-0 border-l"
      >
        <div class="opacity-70 mb-5">Editor</div>
        <svelte:component this={editorViewMap[$currentEditorView]} />
      </div>
    </div>
  </div>
</div>
