<script>
  import { createEventDispatcher } from 'svelte'
  import { addSnack } from '/@/store/snackbar'
  import { state } from '/@/store/state'
  import { Project } from '/@/utils/validation-structs'
  import InputFile from './base/InputFile.svelte'

  const dispatch = createEventDispatcher()

  let files

  $: if (files && files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => importProject(JSON.parse(e.target.result))
    reader.readAsText(files[0])
  }

  function importProject(data) {
    try {
      const projectData = coerce(data, Project)

      // Make sure there's no duplicate id, if the user supplied one
      if ($state.projects.some((v) => v.id === projectData.id)) {
        projectData.id = nanoid(6)
      }

      state.update('Import project', (state) => {
        state.projects.push(projectData)
      })

      dispatch('import', projectData.id)
    } catch (e) {
      // Ahh error. Show snackbar.
      // TODO: Better error display
      addSnack({ type: 'error', message: e.message })
    }
  }
</script>

<InputFile bind:files>
  <slot />
</InputFile>
