<script>
  import { tick } from 'svelte'
  import { link, navigate } from 'svelte-navigator'

  const isProd = process.env.NODE_ENV === 'production'
  const fallbackHref = '/dashboard'

  // If production, just route to dashboard
  if (isProd) {
    tick().then(() => navigate(fallbackHref, { replace: true }))
  }
</script>

{#if !isProd}
  <h1>Development 404 page</h1>
  <p>Oops.. The app accidentally route here.</p>
  <p>
    If this is expected, you can go to
    <a use:link href={fallbackHref} replace>production fallback</a>
  </p>
{/if}
