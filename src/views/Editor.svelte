<script>
  import { currentEditorView, editorViews } from '@/store/editor'
  import EditorColorPanel from './Editor/ColorPanel.svelte'
  import EditorEditColor from './Editor/EditColor.svelte'
  import EditorHeader from './Editor/Header.svelte'
  import EditorNewColor from './Editor/NewColor.svelte'

  const editorViewMap = Object.freeze({
    // TODO: Add default empty view
    [editorViews.empty]: undefined,
    [editorViews.editColor]: EditorEditColor,
    [editorViews.newColor]: EditorNewColor
  })
</script>

<div class="h-full flex flex-col">
  <EditorHeader />
  <div class="container flex-grow">
    <div class="h-full py-6 flex flex-col md:flex-row">
      <div class="w-full h-full md:w-1/3 pb-3 md:pb-0 md:pr-6">
        <EditorColorPanel />
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
