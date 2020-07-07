import { writable } from 'svelte/store'
import { storageGetItem } from '@/utils/common'

/**
 * Create a store that syncs with web storage
 * @param {Storage} storage
 * @param {string} key
 * @param {T} defaultValue
 * @template T
 */
export function storageStore(storage, key, defaultValue) {
  const value = storageGetItem(storage, key, defaultValue)

  const store = writable(value)

  store.subscribe((store) => {
    if (storage.getItem(key) !== store) {
      storage.setItem(key, JSON.stringify(store))
    }
  })

  window.addEventListener('storage', (e) => {
    if (e.key === key) {
      store.set(e.newValue)
    }
  })

  return store
}
