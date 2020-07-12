const path = require('path')
const svite = require('svite')

module.exports = {
  plugins: [svite()],
  alias: {
    '/@/': path.resolve(__dirname, 'src')
  }
}
