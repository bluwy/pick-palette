<script>
  import Icon from 'svelte-fa'
  import { faAngry } from '@fortawesome/free-regular-svg-icons'
</script>

<header class="shadow-md">
  <div class="container py-2">
    <div class="flex flex-row justify-between items-center">
      <div>PICK</div>
      <div>
        <button class="button--outline">
          <Icon class="inline pr-1" icon={faAngry} />
          Export
        </button>
        <button>
          <Icon class="inline pr-1" icon={faAngry} />
          Export
        </button>
      </div>
    </div>
  </div>
</header>
