import { VuexModule } from 'vuex-typed-modules';
import Vue from 'vue';
import { InfoToast, SuccessToast } from '@constructors';
import { routerPagesNames } from '@models';
import { setToken, clearToken } from '@services';
import { AlertsModule, ToastModule } from './Display';
import { disconnect } from 'process';

interface User {
  name: string;
}

export interface IAuthState {
  authChecked?: boolean;
  loggedIn: boolean;
  user?: User | null;
  hideHeader?: boolean;
}

const initialState: IAuthState = {
  loggedIn: false,
  hideHeader: false,
};

// State
const state: IAuthState = {
  ...initialState,
  authChecked: false,
};

const mutations = {
  connectUser(state: IAuthState, infos: User) {
    state.user = infos;
    state.loggedIn = true;
  },
  disconnectUser(state: IAuthState) {
    state.user = null;
    state.loggedIn = false;
  },
  updateUser(state: IAuthState, data: Partial<User>) {
    Object.keys(data).map((key) => {
      if (state.user) {
        Vue.set(state.user, key, data[key]);
      }
    });
  },
};

const actions = {
  async connexionRequest(
    ctx,
    { email, password, nextRoute }: any & { nextRoute: string }
  ): Promise<void> {
    AuthModule.helpers.updateState({ authChecked: true });
    // $nuxt.$router.push({ name: routerPagesNames.admin.index });
    // InfoToast(`Bonjour ${user.name}!`);
  },

  async disconnect(): Promise<void> {
    AuthModule.helpers.updateState({
      loggedIn: false,
      user: null,
    });
    AlertsModule.helpers.resetState();
    ToastModule.helpers.resetState();
    // $nuxt.$router.push({ name: routerPagesNames.login });
  },
};

export const AuthModule = new VuexModule({
  name: 'AuthModule',
  state,
  mutations,
  actions,
});
