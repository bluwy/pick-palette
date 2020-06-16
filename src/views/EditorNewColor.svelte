<script>
  import { dispatch } from '../store/state'
  import { currentEditorView, editorViews } from '../store/editor'
  import Button from '../components/base/Button.svelte'

  const smartCreate = () => {
    // Open smart create view
    $currentEditorView = editorViews.smartCreate
  }

  const manualCreate = () => {
    // Create empty set of shades
    dispatch((state) => {
      const currentProject = state.projects[state.selected]

      currentProject.colors.push({
        name: 'Untitled',
        shades: Array.from({ length: 9 }, () => '#ffffff')
      })
    })

    // Open color edit view
    $currentEditorView = editorViews.editColor
  }
</script>

<div class="text-center">
  <h1 class="text-xl mb-10">Choose how to create your new color</h1>
  <Button on:click={smartCreate}>Smart create</Button>
  <p class="mt-2 opacity-70">
    Give us a few colors and we will generate all the shades!
  </p>
  <p class="my-4 opacity-50">or</p>
  <Button on:click={manualCreate}>Manual create</Button>
  <p class="mt-2 opacity-70">
    Start with empty shades and manually add colors.
  </p>
</div>
