import { enablePatches } from 'immer'
import App from './App.svelte'
import './tailwind.css'

// For undo/redo
enablePatches()

const app = new App({
  target: document.getElementById('app')
})

export default app
