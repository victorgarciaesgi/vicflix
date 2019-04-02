const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js'];
let FaviconsWebpackPlugin = require('favicons-webpack-plugin');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  configureWebpack: config => {
    config.resolve.alias = {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components/index.ts'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@icons': path.resolve(__dirname, 'src/assets/icons'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@images': path.resolve(__dirname, 'src/assets/images'),
      '@constructors': path.resolve(__dirname, 'src/constructors/index.ts'),
      '@services': path.resolve(__dirname, 'src/services/index.ts'),
      '@fonts': path.resolve(__dirname, 'src/assets/fonts'),
      '@graphql': path.resolve(__dirname, 'src/graphql/index.ts'),
      '@utils': path.resolve(__dirname, 'src/utils/index.ts'),
      '@css': path.resolve(__dirname, 'src/styles/root.scss'),
      '@router': path.resolve(__dirname, 'src/router/index.ts'),
      '@validators': path.resolve(__dirname, 'src/utils/validators.ts'),
      '@methods': path.resolve(__dirname, 'src/utils/methods.ts'),
      '@filters': path.resolve(__dirname, 'src/utils/filters.ts'),
      '@paths': path.resolve(__dirname, 'src/services/Api/ApiRoutes.ts'),
      '@models': path.resolve(__dirname, 'src/models/index.ts'),
      '@store': path.resolve(__dirname, 'src/store/index.ts'),
      '@modules': path.resolve(__dirname, 'src/store/Modules/index.ts'),
    };
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer = [
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
          cache: './.build_cache/terser',
          sourceMap: true,
          parallel: true,
          terserOptions: {
            ie8: false,
            ecma: 6,
            mangle: true,
            output: {
              comments: false,
              beautify: false,
            },
            compress: { hoist_funs: false, drop_console: true },
            warnings: false,
          },
        }),
      ];
      // config.plugins.push(new BundleAnalyzerPlugin())
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8,
        })
      );
    }
    config.plugins.push(
      new FaviconsWebpackPlugin({
        logo: './public/favicon.png',
        prefix: 'icons-[name]/',
        emitStats: false,
        statsFilename: 'iconstats-[name].json',
        persistentCache: true,
        inject: true,
        background: '#000',
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: true,
          opengraph: true,
          twitter: true,
          yandex: false,
          windows: false,
        },
      })
    );
  },

  css: {
    loaderOptions: {
      sass: {
        outputStyle: 'compressed',
        sourceMap: true,
        sourceMapContents: true,
        data: `
          @import "src/styles/colors.scss";
          @import "src/styles/variables.scss";
          @import "src/styles/mixins.scss";
        `,
        esModule: true,
      },
    },
  },

  devServer: {
    port: 5080,
    historyApiFallback: true,
    disableHostCheck: true,
    host: '0.0.0.0',
    open: true,
  },

  pluginOptions: {
    i18n: {
      locale: 'fr',
      fallbackLocale: 'fr',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
};
