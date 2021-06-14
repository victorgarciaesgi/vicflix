import path from 'path';
import { NuxtOptionsBuild } from '@nuxt/types/config/build';
import chalk from 'chalk';
import { IgnorePlugin } from 'webpack';
import dotenv from 'dotenv';

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

// Load envs from 'env.${STAGE}'
const stage = process.env.NUXT_ENV_STAGE;
dotenv.config({ path: `./.env.${stage}` });
dotenv.config({ path: `./.env.defaults` });

type nodeEnvs = 'development' | 'production' | 'testing' | 'staging';

const testEnv: nodeEnvs[] = ['development', 'testing'];

console.log(`\nNODE_ENV: ${chalk.magenta(process.env.NODE_ENV)}`);
Object.entries(process.env).forEach(([key, value]) => {
  if (typeof key === 'string' && key.startsWith('NUXT_ENV_')) {
    console.log(`${chalk.bold(key)}: ${chalk.cyan(value)}`);
  }
});
console.log('\n');

export const build: NuxtOptionsBuild = {
  analyze: false,
  extractCSS: isProd,
  optimizeCSS: isProd,
  friendlyErrors: isProd,
  parallel: false,
  transpile: ['lodash-es'],
  devtools: testEnv.includes(process.env.NUXT_ENV_STAGE as any),
  postcss: {
    plugins: {
      autoprefixer: {},
      'postcss-nested': {},
      'postcss-mixins': {
        mixins: {
          light: {
            'html.light &': {
              '@mixin-content': {},
            },
          },
          dark: {
            'html.dark &': {
              '@mixin-content': {},
            },
          },
        },
      },
      'postcss-simple-vars': {},
      'postcss-hexrgba': {},
      'postcss-extend': {},
      'postcss-atroot': {},
      'postcss-current-selector': {},
    },
  },
  extend(config, { isDev, isClient }) {
    if (config.performance) config.performance.hints = 'warning';
    if (config.resolve) config.resolve.symlinks = false;

    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@components': path.resolve(__dirname, '../src/components'),
        '@global': path.resolve(__dirname, '../src/components/Global/index.ts'),
        '@icons': path.resolve(__dirname, '../src/assets/icons'),
        '@assets': path.resolve(__dirname, '../src/assets'),
        '@images': path.resolve(__dirname, '../src/assets/images'),
        '@constructors': path.resolve(__dirname, '../src/constructors/index.ts'),
        '@mixins': path.resolve(__dirname, '../src/mixins/index.ts'),
        '@services': path.resolve(__dirname, '../src/services/index.ts'),
        '@middleware': path.resolve(__dirname, '../src/middleware/index.ts'),
        '@utils': path.resolve(__dirname, '../src/utils/index.ts'),
        '@constants': path.resolve(__dirname, '../src/constants/index.ts'),
        '@data': path.resolve(__dirname, '../src/data/index.ts'),
        '@decorators': path.resolve(__dirname, '../src/decorators/index.ts'),
        '@hooks': path.resolve(__dirname, '../src/hooks/index.ts'),
        '@colors': path.resolve(__dirname, '../src/styles/colors.module.js'),
        '@models': path.resolve(__dirname, '../src/models/index.ts'),
        '@locales': path.resolve(__dirname, '../src/locales/index.ts'),
        '@store': path.resolve(__dirname, '../src/vuex-modules/index.ts'),
      };
    }
    if (config.module) {
      const urlLoader = config.module.rules.find((rule) => String(rule.test).includes('svg'));
      if (urlLoader) urlLoader.test = /\.(png|jpe?g|gif)$/;
      config.module.rules.unshift({
        test: /\.svg$/,
        include: [path.resolve(__dirname, '../src/assets/icons')],
        enforce: 'pre',
        loader: 'svg-inline-loader',
      });
      config.module.rules.push({
        test: /\.svg$/,
        include: [path.resolve(__dirname, '../src/assets/images')],
        loader: 'url-loader',
        query: {
          limit: 1000,
          name: 'img/[name].[hash:7].[ext]',
        },
      });
    }
  },
  babel: {
    // presets({ isServer }) {
    //   return [
    //     [
    //       require.resolve('@nuxt/babel-preset-app'),
    //       {
    //         buildTarget: isServer ? 'server' : 'client',
    //         corejs: { version: 2 },
    //       },
    //     ],
    //   ];
    // },
  },
  optimization: {
    runtimeChunk: true,
    removeAvailableModules: isProd,
    removeEmptyChunks: isProd,
    ...(isProd && {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
        cacheGroups: {
          node_vendors: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 1,
          },
          styles: {
            name: 'styles',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true,
          },
          scripts: {
            name: 'scripts',
            test: /\.(js|ts)$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    }),
  },
  loaders: {
    vue: {
      prettify: false,
    },
    file: {
      esModule: false,
    } as any,
  },

  terser: {
    terserOptions: {
      compress: {
        ...(!testEnv.includes(process.env.NUXT_ENV_STAGE) && {
          drop_console: true,
        }),
      },
    },
  },
};
