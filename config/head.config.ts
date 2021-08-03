import { MetaInfo } from 'vue-meta';

const version = require('../package.json').version;
const isProduction = process.env.NUXT_ENV_STAGE === 'production';

const head: MetaInfo = {
  title: process.env.NUXT_ENV_NAME,
  titleTemplate: `%s | ${process.env.NUXT_ENV_NAME}${isProduction ? '' : ` v${version}`}`,
  meta: [
    { charset: 'utf-8' },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1',
    },
    {
      hid: 'description',
      name: 'description',
      content: process.env.npm_package_description || '',
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: `${process.env.NUXT_ENV_NAME}${isProduction ? '' : ` v${version}`}`,
    },
    {
      hid: 'og:locale',
      property: 'og:locale',
      content: 'fr_FR',
    },
    {
      hid: 'og:type',
      property: 'og:type',
      content: 'website',
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: process.env.npm_package_description || '',
    },
    {
      hid: 'og:site_name',
      property: 'og:site_name',
      content: process.env.NUXT_ENV_NAME,
    },
    {
      hid: 'og:url',
      property: 'og:url',
      content: process.env.NUXT_ENV_URL,
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: `${process.env.NUXT_ENV_URL}/vicflix.png`,
    },
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
};

const robots = {
  UserAgent: '*',
  Disallow: ['/watch/'],
};

const pwa = {
  workbox: {
    navigateFallback: 'index.html',
  },
  manifest: {
    name: process.env.NUXT_ENV_NAME,
    short_name: process.env.NUXT_ENV_NAME,
    lang: 'fr',
    orientation: 'portrait',
    display: 'standalone',
    theme_color: '#000',
  },
};

const sitemap = {
  hostname: process.env.NUXT_ENV_URL,
  exclude: ['/watch/**'],
  path: '/sitemap.xml',
};

export default { head, robots, pwa, sitemap };
