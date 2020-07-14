module.exports = {
  preprocess: require('svelte-preprocess')({
    postcss: true,
    typescript: true,
    defaults: { script: 'typescript' }
  })
}
