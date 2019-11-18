const { join } = require('path')
const { VueLoaderPlugin } = require('vue-loader')

/** @type {import('webpack').Configuration} */
module.exports = {
  context: join(__dirname, 'example'),
  entry: {
    index: './src/index.js',
  },
  output: {
    path: join(__dirname, 'example/dist'),
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      { test: /\.ts$/, loader: 'ts-loader' },
    ],
  },
  plugins: [new VueLoaderPlugin()],
}
