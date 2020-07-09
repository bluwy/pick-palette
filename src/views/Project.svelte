<script>
  import { Route } from 'svelte-router-spa'
  import ColorPanel from '@/components/Project/ColorPanel.svelte'
  import Header from '@/components/Project/Header.svelte'

  export let currentRoute
</script>

<div class="h-full flex flex-col">
  <Header {currentRoute} />
  <div class="container flex-grow overflow-y-auto">
    <div class="h-full py-6 flex flex-col md:flex-row">
      <div class="w-full h-full md:w-1/3 pb-3 md:pb-0 md:pr-6">
        <ColorPanel {currentRoute} />
      </div>
      <div
        class="flex flex-col w-full h-full md:w-2/3 pt-3 md:pt-0 md:pl-6
        border-t border-gray-500 border-opacity-50 md:border-t-0 border-l"
      >
        <div class="opacity-70 mb-5">Editor</div>
        <Route {currentRoute} />
      </div>
    </div>
  </div>
</div>
