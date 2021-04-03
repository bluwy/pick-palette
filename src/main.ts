import { enablePatches } from 'immer'
import App from './App.svelte'
import './router'
import 'virtual:windi.css'
import './main.css'

// For undo/redo
enablePatches()

const app = new App({
  target: document.getElementById('app')!
})

export default app
