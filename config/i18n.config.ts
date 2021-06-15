import { Options } from 'nuxt-i18n';

const isProd = process.env.NODE_ENV === 'production';

export const i18n: Options = {
  locales: [
    { code: 'en', iso: 'en-US', name: 'English', file: 'en.ts' },
    { code: 'fr', iso: 'fr-FR', name: 'Français', file: 'fr.ts' },
  ],
  defaultLocale: process.env.NUXT_ENV_I18N_LOCALE,
  vueI18n: {
    fallbackLocale: process.env.NUXT_ENV_I18N_FALLBACK_LOCALE,
  },
  strategy: 'no_prefix',
  lazy: isProd,
  langDir: 'locales/',
  seo: false,
  vuex: {
    moduleName: 'i18n',
    syncLocale: true,
  },
  detectBrowserLanguage: {
    onlyOnRoot: true,
    useCookie: true,
    cookieKey: 'site_language',
    fallbackLocale: 'fr',
  },
};
