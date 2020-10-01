import { NuxtConfig } from '@nuxt/types';
import dotenv from 'dotenv-extended';

// Load envs from 'env.${STAGE}'
const stage = process.env.NUXT_ENV_STAGE;
dotenv.load({ path: `.env.${stage}` });
process.env.DEBUG = 'nuxt:*';

import { build } from './config/build.config';
import head from './config/head.config';
import { modules } from './config/modules.config';
import colors from './src/styles/colors.module';

const isProd = process.env.NODE_ENV === 'production';
const isSsr = process.env.NUXT_ENV_MODE === 'universal';

const config: NuxtConfig = {
  ssr: isSsr,
  modern: false,
  srcDir: './src',
  rootDir: './',
  ...head,
  build,
  modules,
  typedRouter: {
    filePath: 'src/models/__routes.ts',
  },
  loading: {
    color: colors.g40,
    failedColor: colors.redError,
    height: '4px',
  },
  server: {
    port: process.env.NUXT_ENV_PORT,
    host: '0.0.0.0',
  },
  ...(isSsr && { serverMiddleware: ['~/api/server.middleware'] }),
  plugins: [
    { src: '~/plugins/global.plugin.ts', mode: 'all' },
    { src: '~/plugins/toasts.plugin.ts', mode: 'all' },
    { src: '~/plugins/serviceworker.plugin.ts', mode: 'client' },
  ],
  router: {
    middleware: ['router.middleware'],
  },
  css: ['~/styles/tailwind.pcss', '~/styles/root.pcss'],
  buildModules: ['@nuxt/typescript-build'],
};

export default config;
