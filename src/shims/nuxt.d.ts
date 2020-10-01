import { NuxtApp } from '@nuxt/types';
import VueRouter, { Location } from 'vue-router';

declare module '@nuxt/types' {
  interface Configuration {
    styleResources?: {
      sass?: string[] | string;
      scss?: string[] | string;
      less?: string[] | string;
      stylus?: string[] | string;
    };
    purgeCss?: any;
  }
}

declare global {
  const $nuxt: NuxtApp;
  const workbox: any;
}

import * as Constants from '@constants';
import { ErrorToast, InfoToast, SuccessToast, WarningToast } from '@constructors';

declare module 'vue/types/vue' {
  interface Vue {
    $constants: typeof Constants;
    $toast: {
      success: typeof SuccessToast;
      error: typeof ErrorToast;
      warning: typeof WarningToast;
      info: typeof InfoToast;
    };
    isMounted: boolean;
    isCreated: boolean;
  }
}

// declare module '@vue/composition-api' {
//   declare interface ComponentOptionsWithProps {
//     asyncData?(ctx: Context): Promise<object | void> | object | void;
//     fetch?(ctx: Context): Promise<void> | void;
//     head?: MetaInfo | (() => MetaInfo);
//     key?: string | ((to: Route) => string);
//     layout?: string | ((ctx: Context) => string);
//     loading?: boolean;
//     middleware?: Middleware | Middleware[];
//     scrollToTop?: boolean;
//     transition?: string | Transition | ((to: Route, from: Route) => string);
//     validate?(ctx: Context): Promise<boolean> | boolean;
//     watchQuery?:
//       | boolean
//       | string[]
//       | ((newQuery: Route['query'], oldQuery: Route['query']) => boolean);
//     meta?: { [key: string]: any };
//   }
//   declare interface ComponentOptionsWithoutProps {
//     asyncData?(ctx: Context): Promise<object | void> | object | void;
//     fetch?(ctx: Context): Promise<void> | void;
//     head?: MetaInfo | (() => MetaInfo);
//     key?: string | ((to: Route) => string);
//     layout?: string | ((ctx: Context) => string);
//     loading?: boolean;
//     middleware?: Middleware | Middleware[];
//     scrollToTop?: boolean;
//     transition?: string | Transition | ((to: Route, from: Route) => string);
//     validate?(ctx: Context): Promise<boolean> | boolean;
//     watchQuery?:
//       | boolean
//       | string[]
//       | ((newQuery: Route['query'], oldQuery: Route['query']) => boolean);
//     meta?: { [key: string]: any };
//   }
// }
