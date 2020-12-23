import { computed, unref } from '@nuxtjs/composition-api';
import { AuthModule, ToastModule } from '@store';
import { VuexModule } from 'vuex-typed-modules';
import { DynamicModuleInstance } from 'vuex-typed-modules/types/modules/dynamic';
import { ReturnedActions, ReturnedGetters } from 'vuex-typed-modules/types/types';
import { ActionHandler, GetterTree, MutationTree } from 'vuex/types/index';

export function useModule<
  S extends Record<string, any>,
  M extends MutationTree<S>,
  G extends GetterTree<S, any>,
  A extends Record<string, ActionHandler<S, any>>
>({
  actions,
  state,
  getters,
  mutations,
  updateState,
  resetState,
}: VuexModule<S, M, G, A> | DynamicModuleInstance<S, M, G, A>) {
  const _state = computed(() => state);
  const _getters = computed(() => getters);

  return {
    state: unref(_state),
    getters: unref(_getters),
    mutations,
    actions,
    updateState,
    resetState,
  };
}
