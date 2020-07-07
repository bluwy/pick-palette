import { assert, coerce } from 'superstruct'
import { storageGetItem } from '@/utils/common'
import { State } from '@/utils/validation-structs'
import { historyStore } from './base/history-store'

// Maximum history records for state updates
const historyLimit = 50

// Key used for web storage saves
const stateKey = 'ppdata'

// State version for future migrations
const stateVersion = 1

// Default if none in web storage
const defaultState = {
  version: stateVersion,
  projects: []
}

// Get initial state from local storage
/** @type {import('superstruct').StructType<State>} */
let initialState = storageGetItem(localStorage, stateKey, defaultState)

// Make sure state is not tampered and set default values
initialState = coerce(initialState, State)

export const state = historyStore(initialState, { limit: historyLimit })

state.subscribe((state) => {
  // Run state validation in development
  if (process.env.NODE_ENV !== 'production') {
    assert(state, State)
  }

  localStorage.setItem(stateKey, JSON.stringify(state))
})
