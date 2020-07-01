import { coerce } from 'superstruct'
import { historyStore } from '@/utils/history-store'
import { State } from '@/utils/validation-structs'

// Maximum history records for state updates
const maxHistoryStack = 50

// Key used for web storage saves
const stateKey = 'ppdata'

// State version for future migrations
const stateVersion = 1

// Default if none in web storage
const defaultState = {
  version: stateVersion,
  selected: -1,
  projects: []
}

// Get initial data from web storage
const stateStr = localStorage.getItem(stateKey)

/** @type {import('superstruct').StructType<State>} */
let initialState = stateStr ? JSON.parse(stateStr) : defaultState

// Make sure state is not tampered and set default values
initialState = coerce(initialState, State)

export const { store: state, dispatch, undo, redo } = historyStore(
  initialState,
  {
    maxHistoryStack,
    beforeUpdate: (state) => {
      // Make sure default values are set per update.
      // TODO: Measure performance penalty
      state = coerce(state, State)
      return true
    }
  }
)

state.subscribe((v) => {
  localStorage.setItem(stateKey, JSON.stringify(v))
})
