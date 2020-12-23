import { VuexModule } from 'vuex-typed-modules';
import { User } from '@models';
import { clearToken } from '@services';
import { AlertsModule, ToastModule } from './shared';

export interface IAuthState {
  loggedIn: boolean;
  user: User | null;
  hideHeader?: boolean;
  showProfilePicker: boolean;
}

const state: IAuthState = {
  loggedIn: true,
  hideHeader: false,
  user: null,
  showProfilePicker: false,
};

export const AuthModule = new VuexModule({
  name: 'AuthModule',
  state,
  mutations: {
    connectUser(state, { user, token }: { user: User; token?: string }) {
      state.user = user;
      state.loggedIn = true;
    },
    disconnectUser(state) {
      state.user = null;
      state.loggedIn = false;
      state.showProfilePicker = true;
    },
  },

  actions: {
    async connexionRequest(ctx): Promise<void> {},
    async disconnectUser() {
      await clearToken();
      AuthModule.mutations.disconnectUser();
      AlertsModule.resetState();
      ToastModule.resetState();
    },
  },
});
