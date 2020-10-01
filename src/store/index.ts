import { AssertionError } from 'assert';
import { Database } from 'vuex-typed-modules';
import { Context } from '@nuxt/types';
import { getToken, clearToken } from '@services';
import * as Modules from './modules';

const database = new Database({ logger: process.browser });

const modules = Object.keys(Modules).map((key) => Modules[key]);
export const plugins = [database.deploy(modules)];

export const state = () => ({});
export const strict = false;

let refreshing = false;

export const actions = {
  async nuxtClientInit(ctx, { app, req }: Context) {
    if (process.browser && process.env.NODE_ENV === 'production') {
      document.addEventListener('touchstart', (e) => {}, { passive: true });
      document.addEventListener('touchmove', (e) => {}, { passive: true });
    }
    const access_token = getToken();
    if (access_token) {
      try {
        // Modules.AuthModule.helpers.updateState({ token: access_token });
        // const customer = await sgts.me().$fetch();
        // Modules.AuthModule.mutations.connectUser(customer);
      } catch (e) {
        console.log(e);
        clearToken();
        Modules.AuthModule.mutations.disconnectUser();
      }
    } else {
      clearToken();
      Modules.AuthModule.mutations.disconnectUser();
    }
  },
};
