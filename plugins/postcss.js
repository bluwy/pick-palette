import { createFilter } from '@rollup/pluginutils'
import postcss from 'postcss'
import loadConfig from 'postcss-load-config'

// Load all css file, pass through postcss and emit all as a single bundle
// Adapted from: https://github.com/thgh/rollup-plugin-css-only
export default function (options = {}) {
  const filter = createFilter(options.include || '**/*.css', options.exclude)
  const styles = {}
  let changes = 0

  return {
    name: 'postcss',
    async transform(code, id) {
      if (!filter(id)) {
        return
      }

      const config = await loadConfig(id)
      const result = await postcss(config.plugins).process(code, { from: id })

      for (const warning of result.warnings()) {
        this.warn(warning.message || warning.text)
      }

      if (styles[id] !== result.css) {
        styles[id] = result.css
        changes++
      }

      return ''
    },
    generateBundle() {
      if (changes <= 0) {
        return
      }

      const css = Object.values(styles).reduce((a, v) => a + v)

      this.emitFile({
        type: 'asset',
        fileName: options.output,
        source: css
      })
    }
  }
}
