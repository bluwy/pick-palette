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
