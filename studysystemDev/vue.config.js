var webpack = require('webpack')
module.exports = {
  
    // 基本路径
    baseUrl: './',
    // 输出文件目录
    outputDir: 'dist',
    devServer: {
      proxy: 'http://localhost:9001'
//       proxy: 'http://192.168.1.46:8080'
    },
    // pluginOptions: {
    //   foo: {
    //     // 插件可以作为 `options.pluginOptions.foo` 访问这些选项。
    //   }
    // }
    configureWebpack: {
      plugins: [
          new webpack.ProvidePlugin({
              $: 'jquery',
              jQuery: 'jquery',
              'window.jQuery': 'jquery',
              Popper: ['popper.js', 'default']
            })
      ]
    }
  }