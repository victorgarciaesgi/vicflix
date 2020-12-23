import { NuxtVueI18n } from 'nuxt-i18n';
import * as LocaleFiles from '../src/locales';

const locales = Object.entries(LocaleFiles).map<NuxtVueI18n.Options.LocaleObject>(
  ([
    key,
    {
      config: { code, iso },
    },
  ]) => {
    return {
      code,
      iso,
      file: `${key}.ts`,
    };
  }
);

export const i18n: NuxtVueI18n.Options.AllOptionsInterface = {
  locales,
  defaultLocale: process.env.NUXT_ENV_I18N_LOCALE,
  vueI18n: {
    fallbackLocale: process.env.NUXT_ENV_I18N_FALLBACK_LOCALE,
  },
  strategy: 'no_prefix',
  lazy: true,
  langDir: 'locales/',
  seo: false,
  detectBrowserLanguage: false,
};
