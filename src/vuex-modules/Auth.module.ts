import { VuexModule } from 'vuex-typed-modules';
import { User } from '@models';
import { AlertsModule, ToastModule } from './shared';

export interface IAuthState {
  loggedIn: boolean;
  user: User | null;
  hideHeader: boolean;
  hideNav: boolean;
}

const state: IAuthState = {
  loggedIn: false,
  hideHeader: false,
  hideNav: false,
  user: null,
};

export const AuthModule = new VuexModule({
  name: 'AuthModule',
  state,
  mutations: {
    connectUser(state, user: User) {
      state.user = user;
      state.loggedIn = true;
    },
    disconnectUser(state) {
      state.user = null;
      state.loggedIn = false;
    },
  },

  actions: {
    async connexionRequest(ctx, user: User): Promise<void> {
      try {
        AuthModule.mutations.connectUser(user);
      } catch (e) {
        console.log(e);
      }
    },
    async disconnectUser() {
      AuthModule.mutations.disconnectUser();
      AlertsModule.resetState();
      ToastModule.resetState();
    },
  },
});
