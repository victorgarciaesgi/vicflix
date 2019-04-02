import { defineModule } from '@/vuex-typed-modules';
import { IUserState, IProfil } from '@models';
import { Router, routesNames } from '@router';
import { UserNotification, SuccessNotification } from '@constructors';
import { oc } from 'ts-optchain';
import { deleteProfile, getProfile, storeProfile } from './Storage.module';

const initialState: IUserState = {
  profil: null,
  loggedIn: false,
};

//State
const state: IUserState = {
  ...initialState,
  authChecked: false,
};

const getters = {
  getFullName({ profil }: IUserState) {
    return oc(profil).name();
  },
};

const mutations = {
  connectUser(state: IUserState, infos: IProfil) {
    state.profil = infos;
    state.loggedIn = true;
    state.authChecked = true;
  },

  updateUserState(state: IUserState, data: Partial<IUserState>) {
    Object.keys(data).map(key => {
      state[key] = data[key];
    });
  },
  disconnectUser(state: IUserState) {
    Object.keys(initialState).map(key => {
      state[key] = initialState[key];
    });
  },
};

const actions = {
  async connectUser(context, profil: IProfil) {
    await storeProfile(profil);
    UserModule.mutations.connectUser(profil);
    Router.push('/browse');
  },
  async checkUserSession(context) {
    if (!UserModule.state.loggedIn) {
      await UserModule.actions.reloadUserInfos();
      UserModule.mutations.updateUserState({
        authChecked: true,
      });
    }
  },

  async reloadUserInfos(context) {
    const profil = await getProfile();
    if (profil) {
      UserModule.mutations.connectUser(profil);
    }
  },
  async disconnectRequest(context) {
    await deleteProfile();
    UserModule.mutations.disconnectUser();
    Router.push({ name: routesNames.WHOAMI });
  },
};

export const UserModule = defineModule('UserModule', state, {
  mutations,
  actions,
  getters,
});
