<script>
  import { openedProjectIds, projects } from '/@/store/project'
  import ColorBox from '/@/components/base/ColorBox.svelte'

  export let projectId

  $: project = $projects.find((v) => v.id === projectId)

  $: isOpened = $openedProjectIds.includes(projectId)

  $: href = isOpened ? '' : `project/${projectId}`

  $: title = isOpened
    ? "Cannot open project. It's already opened in another tab."
    : `Open '${project.name}'`
</script>

<a class="item" class:disabled={isOpened} {href} {title} disabled={isOpened}>
  <div class="font-medium textlg mb-1">{project.name}</div>
  <ul class="space-x-1">
    {#each project.colors as color (color.id)}
      <li class="inline-block">
        <ColorBox
          color={color.shades[Math.floor(color.shades.length / 2)]}
          small
        />
      </li>
    {/each}
  </ul>
</a>

<style lang="postcss">
  .item {
    @apply inline-block w-full h-full px-3 py-2 rounded bg-primary-200 bg-opacity-20 text-primary-700 border border-primary-500 transition-colors duration-200;
  }

  .item:hover,
  .item:focus {
    @apply bg-opacity-40;
  }

  .item.disabled {
    @apply bg-gray-200 text-gray-700 border-gray-500 cursor-not-allowed;
  }
</style>
