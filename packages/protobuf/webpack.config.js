const path = require('path');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: '',
    libraryTarget: 'commonjs-module'
  }
}