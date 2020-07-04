// Reference: https://svelte.dev/repl/0ace7a508bd843b798ae599940a91783?version=3.16.7
/**
 * Emits `clickoutside` event whenever pointer clicks outside of node
 * @param {HTMLElement} node
 */
export default function (node) {
  const handleClick = (e) => {
    if (!node.contains(e.target) && !e.defaultPrevented) {
      node.dispatchEvent(new MouseEvent('clickoutside', e))
    }
  }

  document.addEventListener('click', handleClick)

  return {
    destroy() {
      document.removeEventListener('click', handleClick)
    }
  }
}
