/**
 * Handles `dragenter` and `dragleave` event to only be called once on element
 * only. This makes sure that multiple drag events triggered by element children
 * are all grouped into a single event only.
 */
export function dragOnce(node: HTMLElement) {
  let dragOverElements: EventTarget[] = []

  node.addEventListener('dragenter', handleDragEnter)
  node.addEventListener('dragleave', handleDragLeave)
  node.addEventListener('drop', handleDrop)

  function handleDragEnter(e: DragEvent) {
    if (dragOverElements.length <= 0) {
      node.dispatchEvent(new CustomEvent('dragenteronce'))
    }
    dragOverElements.push(e.target)
  }

  function handleDragLeave(e: DragEvent) {
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

  return {
    destroy() {
      node.removeEventListener('dragenter', handleDragEnter)
      node.removeEventListener('dragleave', handleDragLeave)
      node.removeEventListener('drop', handleDrop)
    }
  }
}
