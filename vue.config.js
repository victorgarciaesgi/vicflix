const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

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
      '@fragments': path.resolve(__dirname, 'src/fragments/index.ts'),
      '@utils': path.resolve(__dirname, 'src/utils/index.ts'),
      '@css': path.resolve(__dirname, 'src/styles/root.scss'),
      '@colors': path.resolve(__dirname, 'src/styles/colors.module.scss'),
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
      config.optimization.splitChunks = {
        chunks: 'async',
        minSize: 30000,
        maxSize: 250000,
        minChunks: 1,
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
      config.optimization.concatenateModules = true;
      config.optimization.minimizer = [
        new TerserPlugin({
          // test: /\.js(\?.*)?$/i,
          cache: true,
          sourceMap: false,
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
            keep_fnames: false,
            safari10: false,
          },
        }),
      ];
      // config.plugins.push(new BundleAnalyzerPlugin());
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.(js|css)$/,
          threshold: 8240,
          minRatio: 0.9,
          cache: true,
        }),
        new BrotliPlugin({
          filename: '[path].br[query]',
          algorithm: 'brotliCompress',
          test: /\.(js|css)$/,
          compressionOptions: { level: 11 },
          threshold: 8240,
          minRatio: 0.9,
          deleteOriginalAssets: false,
          cache: true,
        }),
        new FaviconsWebpackPlugin({
          logo: './public/favicon.png',
          prefix: 'icons/',
          persistentCache: true,
          inject: true,
          background: '#FFF',
          icons: {
            android: { offset: 20 },
            appleIcon: { offset: 20 },
            appleStartup: { offset: 20 },
            coast: false,
            favicons: true,
            firefox: true,
            opengraph: { offset: 20 },
            twitter: true,
            yandex: false,
            windows: false,
          },
        })
      );
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule.use('svg-inline-loader').loader('svg-inline-loader');
  },

  css: {
    loaderOptions: {
      sass: {
        outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : undefined,
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
    port: process.env.VUE_APP_DEV_PORT,
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
  pwa: {
    workboxOptions: {
      cacheId: 'vicflix',
      importWorkboxFrom: 'local',
      navigateFallback: 'index.html',
    },
  },
};
