import { NuxtApp } from '@nuxt/types';
import VueRouter, { Location } from 'vue-router';

declare global {
  const $nuxt: NuxtApp;
  const workbox: any;
}

import * as Constants from '@constants';
import { ErrorToast, InfoToast, SuccessToast, Toast, WarningToast } from '@constructors';
import { LocalesMessages, routerPagesNames } from '@models';
import { pluralize } from '@utils';

declare module 'vue-fragment' {
  export const Fragment: Vue;
}

declare module 'vue/types/vue' {
  interface Vue {
    $constants: typeof Constants;
    $plural: typeof pluralize;
    $messages: LocalesMessages;
    $routesNames: typeof routerPagesNames;
    $toast: {
      success: typeof SuccessToast;
      error: typeof ErrorToast;
      warning: typeof WarningToast;
      info: typeof InfoToast;
      default: typeof Toast;
    };
    isMounted: boolean;
  }
}

declare module '@nuxt/types' {
  interface Context {
    constants: typeof Constants;
    messages: LocalesMessages;
    routesNames: typeof routerPagesNames;
    toast: {
      success: typeof SuccessToast;
      error: typeof ErrorToast;
      warning: typeof WarningToast;
      info: typeof InfoToast;
    };
  }
}
