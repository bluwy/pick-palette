/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max))
}

/**
 * @param {T} fn
 * @param {number} wait
 * @returns {T}
 * @template T
 */
export function debounce(fn, wait) {
  let t
  return function () {
    clearTimeout(t)
    t = setTimeout(() => fn.apply(this, arguments), wait)
  }
}

/**
 * @param {T} fn
 * @param {number} wait
 * @returns {T}
 * @template T
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

/**
 * @param {Array} arr
 * @param {number} removeIndex
 * @param {number} insertIndex
 */
export function removeAndInsertElement(arr, removeIndex, insertIndex) {
  if (removeIndex === insertIndex) {
    return
  }

  if (insertIndex > removeIndex) {
    insertIndex--
  }

  arr.splice(insertIndex, 0, arr.splice(removeIndex, 1)[0])
}

/**
 * @param {number} a
 * @param {number} b
 * @param {number} t Value between 0 and 1
 */
export function lerp(a, b, t) {
  return a + (b - a) * t
}

/**
 * @param {Storage} storage
 * @param {string} key
 * @param {T} [defaultValue]
 * @returns {T}
 * @template T
 */
export function storageGetItem(storage, key, defaultValue) {
  const value = storage.getItem(key)

  if (value != null) {
    return JSON.parse(value)
  }

  if (defaultValue != null) {
    // Doesn't exist in storage, set default value
    storage.setItem(key, JSON.stringify(defaultValue))
    return defaultValue
  }

  return undefined
}

/**
 * Download a text as a file
 * Reference: https://stackoverflow.com/a/43388258/13265944
 * @param {string} text The text to download
 * @param {string} name The file name
 * @param {string} type The MIME type
 */
export function download(text, name, type) {
  const blob = new Blob([text], { type })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  document.body.appendChild(a)
  a.style.display = 'none'
  a.click()
  a.remove()
}
