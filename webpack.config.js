const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    index: './index.js',
    riscv_emu: './riscv_emu_rust_wasm.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].[contenthash].js',
    assetModuleFilename: '[name].[hash][ext][query]'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(wasm|elf|img)$/i,
        type: 'asset/resource'
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'index.html' })
  ]
}
