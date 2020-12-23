// enum AvailableLocales {
//   'FR' = 'fr',
//   'EN' = 'en',
// }
declare namespace NodeJS {
  import { AvailableLocales } from '@models';

  export interface ProcessEnv {
    NUXT_ENV_API_URL: string;
    NUXT_ENV_PORT: number;
    NUXT_ENV_URL: string;
    NUXT_ENV_STAGE: 'development' | 'production' | 'testing' | 'staging';
    NODE_ENV: string;
    NUXT_ENV_I18N_LOCALE: string;
    NUXT_ENV_I18N_FALLBACK_LOCALE: string;
    NUXT_ENV_NAME: string;
    NUXT_ENV_TOKEN_STRATEGY: 'jwt' | 'cookie';
    NUXT_ENV_MODE: 'universal' | 'spa';
    NUXT_ENV_GIT_NAME: string;
    NUXT_ENV_CLIENT_URL: string;
  }
}
