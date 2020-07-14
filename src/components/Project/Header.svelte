<script>
  import { faFileExport } from '@fortawesome/free-solid-svg-icons'
  import Icon from 'svelte-fa'
  import { exportProject } from '/@/store/project'
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
