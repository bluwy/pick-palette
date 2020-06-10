import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'

const svelteConfig = require('./svelte.config')

const isProd = process.env.NODE_ENV === 'production'

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js'
  },
  plugins: [
    svelte({
      ...svelteConfig,
      dev: !isProd,
      css: (css) => {
        css.write('public/build/bundle.css')
      }
    }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
    !isProd && serve('public'),
    !isProd && livereload('public'),
    isProd && terser()
  ],
  watch: {
    clearScreen: false
  }
}
