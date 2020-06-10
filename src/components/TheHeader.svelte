<script>
  import Fa from 'svelte-fa'
  import { faAngry } from '@fortawesome/free-regular-svg-icons'
  import Button from './base/Button.svelte'
</script>

<header class="shadow-md">
  <div class="container py-2">
    <div class="flex flex-row justify-between items-center">
      <div>PICK</div>
      <div>
        <Button outline>
          <Fa class="inline pr-1" icon={faAngry} />
          Export
        </Button>
        <Button>
          <Fa class="inline pr-1" icon={faAngry} />
          Export
        </Button>
      </div>
    </div>
  </div>
</header>
