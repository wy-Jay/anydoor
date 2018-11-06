const path = require ('path')

module.exports = {
  entry: {
    index: './src/script/index.js'
  },
  output: {
    path: path.resolve(__dirname,'build/script'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx/,
        includes: [
          path.resolve(__dirname,'app')
        ],
        exclude: [
          path.resolve(__dirname,'app/demo-files')
        ],
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }
    ]
  }
}