/**
 * Sync store across tabs
 * @param {import('svelte/store').Writable} store
 * @param {string} key
 */
export function synchronize(store, key) {
  const storageValue = localStorage.getItem(key)

  // If have existing value, use it
  if (storageValue != null) {
    store.set(JSON.parse(storageValue))
  }

  /*
    NOTE: The two blocks of code below does not trigger an infinite loop. This
    is because when `localStorage.setItem` is setting the same value as in the
    storage, the storage event will not fire
  */

  // Whenever store data change, update localStorage
  store.subscribe((store) => {
    localStorage.setItem(key, JSON.stringify(store))
  })

  // Whenever localStorage data change, update store
  window.addEventListener('storage', (e) => {
    if (e.key === key && e.newValue != null) {
      store.set(JSON.parse(e.newValue))
    }
  })
}
