import path from 'path';
import { NuxtOptionsBuild } from '@nuxt/types/config/build';
import chalk from 'chalk';

const isProd = process.env.NODE_ENV === 'production';

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
  friendlyErrors: true,
  parallel: false,
  transpile: ['lodash-es'],
  devtools: testEnv.includes(process.env.NUXT_ENV_STAGE as any),
  babel: {
    presets({ isServer }) {
      return [
        [
          require.resolve('@nuxt/babel-preset-app'),
          {
            buildTarget: isServer ? 'server' : 'client',
            corejs: { version: 3 },
          },
        ],
      ];
    },
  },
  extend(config, { isDev, isClient, isServer, loaders }) {
    if (config.performance) config.performance.hints = false;
    if (config.resolve) config.resolve.symlinks = true;
    if (isDev && isClient && config.module) {
      config.module.rules.push({
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules)/,
      });
    }

    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
        '@components': path.resolve(__dirname, '../src/components/index.ts'),
        '@icons': path.resolve(__dirname, '../src/assets/icons'),
        '@assets': path.resolve(__dirname, '../src/assets'),
        '@images': path.resolve(__dirname, '../src/assets/images'),
        '@constructors': path.resolve(__dirname, '../src/constructors/index.ts'),
        '@mixins': path.resolve(__dirname, '../src/components/Mixins/index.ts'),
        '@services': path.resolve(__dirname, '../src/services/index.ts'),
        '@middleware': path.resolve(__dirname, '../src/middleware/index.ts'),
        '@utils': path.resolve(__dirname, '../src/utils/index.ts'),
        '@colors': path.resolve(__dirname, '../src/styles/colors.module.js'),
        '@models': path.resolve(__dirname, '../src/models/index.ts'),
        '@store': path.resolve(__dirname, '../src/store/modules/index.ts'),
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
  optimization: {
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
  postcss: {
    plugins: {
      autoprefixer: {},
      tailwindcss: {},
      'postcss-mixins': {
        mixins: {
          light: {
            "body[data-theme='light'] &": {
              '@mixin-content': {},
            },
          },
          dark: {
            "body[data-theme='dark'] &": {
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
      'postcss-nested': {},
    },
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
