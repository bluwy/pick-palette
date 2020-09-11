const path = require('path')

module.exports = {
  alias: {
    '/@/': path.resolve(__dirname, 'src')
  },
  terserOption: {
    output: {
      comments: false
    }
  }
}
