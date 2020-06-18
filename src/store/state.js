import { historyStore } from '@/utils/history-store'

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
const initialState = stateStr ? JSON.parse(stateStr) : defaultState

export const { store: state, dispatch, undo, redo } = historyStore(
  initialState,
  { maxHistoryStack: 50 }
)

state.subscribe((v) => {
  localStorage.setItem(stateKey, JSON.stringify(v))
})
