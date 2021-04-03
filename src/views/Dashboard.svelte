<script lang="ts">
  import { projects } from '@/store/projects'
  import Main from '@/components/Dashboard/Main.svelte'
  import Welcome from '@/components/Dashboard/Welcome.svelte'
</script>

{#if $projects.length > 0}
  <Main />
{:else}
  <Welcome />
{/if}
