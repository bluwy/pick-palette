<script lang="ts">
  import { RouterView } from '@bjornlu/svelte-router'
  import Snackbar from './components/Snackbar.svelte'
</script>

<main class="w-full h-full">
  <RouterView />
  <Snackbar />
</main>
