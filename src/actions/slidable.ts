/** Emits `slide` event when sliding on node */
export function slidable(node: HTMLElement) {
  const dispatchSlide = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()

    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0]?.clientX
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0]?.clientY

    if (clientX && clientY) {
      node.dispatchEvent(
        new CustomEvent('slide', {
          detail: { clientX, clientY }
        })
      )
    }
  }

  const handlePointerDown = (e: MouseEvent | TouchEvent) => {
    dispatchSlide(e)
    document.addEventListener('mousemove', dispatchSlide)
    document.addEventListener('touchmove', dispatchSlide)
    document.addEventListener('mouseup', handlePointerUp)
    document.addEventListener('touchend', handlePointerUp)
  }

  const handlePointerUp = (e: MouseEvent | TouchEvent) => {
    dispatchSlide(e)
    document.removeEventListener('mousemove', dispatchSlide)
    document.removeEventListener('touchmove', dispatchSlide)
    document.removeEventListener('mouseup', handlePointerUp)
    document.removeEventListener('touchend', handlePointerUp)
  }

  node.addEventListener('mousedown', handlePointerDown)
  node.addEventListener('touchstart', handlePointerDown)

  return {
    destroy() {
      // Clean up
      node.removeEventListener('mousedown', handlePointerDown)
      node.removeEventListener('touchstart', handlePointerDown)

      // Just in case
      document.removeEventListener('mousemove', dispatchSlide)
      document.removeEventListener('touchmove', dispatchSlide)
      document.removeEventListener('mouseup', handlePointerUp)
      document.removeEventListener('touchend', handlePointerUp)
    }
  }
}
