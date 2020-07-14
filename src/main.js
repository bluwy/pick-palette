import { enablePatches } from 'immer'
import App from './App.svelte'
import './main.css'

// For undo/redo
enablePatches()

const app = new App({
  target: document.getElementById('app')
})

export default app
