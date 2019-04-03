import { defineModule } from '@/vuex-typed-modules';
import { IGlobalState } from '@models';

// State
const state: IGlobalState = {
  mobile: null,
};

// Mutations
const mutations = {
  updateGlobalState(state: IGlobalState, data: Partial<IGlobalState>) {
    Object.keys(data).map(key => {
      state[key] = data[key];
    });
  },
};

// Module
export const GlobalModule = defineModule('GlobalModule', state, {
  mutations,
});
