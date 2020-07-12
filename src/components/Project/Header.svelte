<script>
  import { faFileExport } from '@fortawesome/free-solid-svg-icons'
  import { produce } from 'immer'
  import Icon from 'svelte-fa'
  import { useParams } from 'svelte-navigator'
  import { state } from '/@/store/state'
  import { download } from '/@/utils/common'

  const params = useParams()

  $: projectId = $params.projectId

  function exportProject() {
    const project = $state.projects.find((v) => v.id === projectId)

    // Remove ids to reduce output size
    const projectData = produce(project, (project) => {
      delete project.id

      for (let i = 0; i < project.colors.length; i++) {
        delete project.colors[i].id
      }
    })

    const finalText = JSON.stringify(projectData)
    const fileName = project.name + '.json'
    const fileType = 'application/json'

    download(finalText, fileName, fileType)
  }
</script>

<header class="shadow-md">
  <div class="container py-2">
    <div class="flex flex-row justify-between items-center">
      <div>PICK</div>
      <div>
        <button class="button" on:click={exportProject}>
          <Icon class="inline pr-1" icon={faFileExport} />
          Export
        </button>
      </div>
    </div>
  </div>
</header>
