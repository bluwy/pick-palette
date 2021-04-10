import path from 'path'
import { defineConfig } from 'vite'
import svelte from '@sveltejs/vite-plugin-svelte'
import windicss from 'vite-plugin-windicss'

export default defineConfig({
  plugins: [svelte({ useVitePreprocess: true }), windicss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    exclude: ['svelte-fa', 'svelte-popperjs', '@bjornlu/svelte-router']
  }
})
