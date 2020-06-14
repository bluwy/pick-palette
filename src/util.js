/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max))
}

/**
 * @param {Function} fn
 * @param {number} wait
 * @returns {Function}
 */
export function throttle(fn, wait) {
  let t
  return function () {
    if (t == null) {
      fn.apply(this, arguments)
      t = setTimeout(() => (t = undefined), wait)
    }
  }
}

export function slidable(node) {
  const dispatchSlide = (e) => node.dispatchEvent(new MouseEvent('slide', e))

  const handlePointerDown = (e) => {
    dispatchSlide(e)
    window.addEventListener('mousemove', dispatchSlide)
    window.addEventListener('touchmove', dispatchSlide)
    window.addEventListener('mouseup', handlePointerUp)
    window.addEventListener('touchend', handlePointerUp)
  }

  const handlePointerUp = (e) => {
    dispatchSlide(e)
    window.removeEventListener('mousemove', dispatchSlide)
    window.removeEventListener('touchmove', dispatchSlide)
    window.removeEventListener('mouseup', handlePointerUp)
    window.removeEventListener('touchend', handlePointerUp)
  }

  node.addEventListener('mousedown', handlePointerDown)
  node.addEventListener('touchstart', handlePointerDown)

  return {
    destroy() {
      // Clean up
      node.removeEventListener('mousedown', handlePointerDown)
      node.removeEventListener('touchstart', handlePointerDown)

      // Just in case
      window.removeEventListener('mousemove', dispatchSlide)
      window.removeEventListener('touchmove', dispatchSlide)
      window.removeEventListener('mouseup', handlePointerUp)
      window.removeEventListener('touchend', handlePointerUp)
    }
  }
}
