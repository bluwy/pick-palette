<script>
  import { projects } from '/@/store/projects'
  import Main from './Dashboard/Main.svelte'
  import Welcome from './Dashboard/Welcome.svelte'
</script>

{#if $projects.length > 0}
  <Main />
{:else}
  <Welcome />
{/if}
