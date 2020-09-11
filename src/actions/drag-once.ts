/**
 * Handles `dragenter` and `dragleave` event to only be called once on element
 * only. This makes sure that multiple drag events triggered by element children
 * are all grouped into a single event only.
 */
export function dragOnce(node: HTMLElement) {
  let dragOverElements: EventTarget[] = []

  function handleDragEnter(e: DragEvent) {
    if (e.target == null) {
      return
    }

    if (dragOverElements.length <= 0) {
      node.dispatchEvent(new CustomEvent('dragenteronce'))
    }

    dragOverElements.push(e.target)
  }

  function handleDragLeave(e: DragEvent) {
    if (e.target == null) {
      return
    }

    const index = dragOverElements.indexOf(e.target)

    dragOverElements.splice(index, 1)

    if (dragOverElements.length <= 0) {
      node.dispatchEvent(new CustomEvent('dragleaveonce'))
    }
  }

  function handleDrop() {
    // Reset process
    if (dragOverElements.length > 0) {
      dragOverElements = []
    }
  }

  node.addEventListener('dragenter', handleDragEnter)
  node.addEventListener('dragleave', handleDragLeave)
  node.addEventListener('drop', handleDrop)

  return {
    destroy() {
      node.removeEventListener('dragenter', handleDragEnter)
      node.removeEventListener('dragleave', handleDragLeave)
      node.removeEventListener('drop', handleDrop)
    }
  }
}
