module.exports = {
  productionSourceMap: process.env.NODE_ENV === 'development',

  devServer: {
    open: 'Chrome',
    port: process.env.VUE_APP_PORT || 8088,
    hot: true
  },

  lintOnSave: false,

  /*
   * preload data instead of prefetch
   */
  chainWebpack: config => {
    config.plugins.delete('prefetch')
    config.plugin('preload').tap(options => {
      options[0].include = 'allChunks'
      return options
    })
    config.module
    .rule('i18n')
    .resourceQuery(/blockType=i18n/)
    .type('javascript/auto')
    .use('i18n')
    .loader('@kazupon/vue-i18n-loader')
    .end();

    config.performance.maxEntrypointSize(400000).maxAssetSize(400000);
  }
}
