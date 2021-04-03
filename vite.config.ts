import path from 'path'
import { defineConfig } from 'vite'
import svelte from '@sveltejs/vite-plugin-svelte'
import windicss from 'vite-plugin-windicss'

const windicssPlugins = windicss()

// Once @sveltejs/vite-plugin-svelte makes a new release, this is not needed
// @ts-expect-error
// prettier-ignore
const windicssPreprocess = windicssPlugins.find(v => v.name.includes(':css:svelte')).sveltePreprocess

export default defineConfig({
  plugins: [
    svelte({ useVitePreprocess: true, preprocess: windicssPreprocess }),
    windicssPlugins
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    exclude: ['svelte-fa', 'svelte-popperjs', '@bjornlu/svelte-router']
  }
})
