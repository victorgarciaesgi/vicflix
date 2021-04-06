import { Database } from 'vuex-typed-modules';
import { Context, NuxtAppOptions } from '@nuxt/types';
import VuexPersistence from 'vuex-persist';
import * as Modules from '../vuex-modules';

const database = new Database({ logger: process.browser });

const modules = Object.entries(Modules).map(([key, value]) => value);

const persistLocal = new VuexPersistence({
  reducer: (state: any) => {
    return {
      VideoProgressModule: state.VideoProgressModule,
      AuthModule: state.AuthModule,
      i18n: state.i18n,
    };
  },
  storage: window.localStorage,
});

export const plugins = [database.deploy(modules), persistLocal.plugin];

export const state = () => ({});
export const strict = false;

export const actions = {
  async nuxtClientInit(_: any, { $cookies }: NuxtAppOptions) {
    const user = await Modules.AuthModule.state.user;
    if (user) {
      try {
        Modules.AuthModule.mutations.connectUser(user);
      } catch (e) {
        console.log(e);
        Modules.AuthModule.actions.disconnectUser();
      }
    } else {
      Modules.AuthModule.actions.disconnectUser();
    }
  },
};
