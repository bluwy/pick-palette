<script>
  import { RouterView } from '@bjornlu/svelte-router'
  import Snackbar from './components/Snackbar.svelte'
</script>

<main class="w-full h-screen overflow-hidden">
  <RouterView />
  <Snackbar />
</main>
