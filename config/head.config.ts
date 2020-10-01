import { MetaInfo } from 'vue-meta';

const head: MetaInfo = {
  title: process.env.NUXT_ENV_NAME,
  titleTemplate: `%s | ${process.env.NUXT_ENV_NAME}`,
  meta: [
    { charset: 'utf-8' },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    },
    {
      hid: 'description',
      name: 'description',
      content: process.env.npm_package_description || '',
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: process.env.NUXT_ENV_NAME,
    },
    {
      hid: 'og:locale',
      property: 'og:locale',
      content: 'fr_FR',
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: `${process.env.NUXT_ENV_URL}/icon.png`,
    },
  ],
  htmlAttrs: {
    lang: 'fr',
  },
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
};

const robots = {
  UserAgent: '*',
  Disallow: '/',
};

const pwa = {
  workbox: {
    workboxURL: 'https://cdn.jsdelivr.net/npm/workbox-cdn/workbox/workbox-sw.js',
    skipWaiting: true,
    clientsClaim: true,
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

// Uncomment if deploying for marketing site

// const sitemap = {
//   exclude: ['/me/**'],
//   path: '/sitemap.xml',
//   generate: false,
// };

export default { head, robots, pwa };
