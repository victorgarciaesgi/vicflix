import Vuex, { Store, StoreOptions } from 'vuex';
import Vue from 'vue';
import {
  ReturnedMutations,
  ReturnedActions,
  ReturnedGetters,
  MutationsPayload,
  ActionsPayload,
  GettersPayload,
  SharedMutations,
} from './types';
import { enableHotReload } from './hotModule';
import { oc } from 'ts-optchain';
import { cloneDeep } from 'lodash';
import { Omit, KeepProperties } from '@models';

Vue.use(Vuex);

let storeBuilder: Store<any> = null;
const storedModules: any = {};

function createModuleTriggers(moduleName: string) {
  function commit(name) {
    return payload => storeBuilder.commit(moduleName + '/' + name, payload);
  }

  function dispatch(name) {
    return payload => storeBuilder.dispatch(moduleName + '/' + name, payload);
  }

  function read(name) {
    return () => oc(storeBuilder).getters[moduleName + '/' + name]();
  }

  return {
    commit,
    dispatch,
    read,
    get state() {
      return () => oc(storeBuilder).state[moduleName];
    },
  };
}

function stateBuilder<S>(state: S, name: string) {
  const b = createModuleTriggers(name);

  const registerMutations = <T extends MutationsPayload>(mutations: T): ReturnedMutations<T> => {
    let renderedMutations = {};
    if (mutations) {
      Object.keys(mutations).map(key => {
        renderedMutations[key] = b.commit(key);
      });
    }
    return renderedMutations as any;
  };

  const registerActions = <T extends ActionsPayload>(actions: T): ReturnedActions<T> => {
    let renderedActions = {};
    if (actions) {
      Object.keys(actions).map(key => {
        renderedActions[key] = b.dispatch(key);
      });
    }
    return renderedActions as any;
  };

  const registerGetters = <T extends GettersPayload>(getters: T): ReturnedGetters<T> => {
    let renderedGetters = {};
    if (getters) {
      Object.keys(getters).map((key: any) => {
        Object.defineProperty(renderedGetters, key, {
          get() {
            return b.read(key)();
          },
        });
      });
    }
    return renderedGetters as any;
  };

  return {
    registerMutations,
    registerActions,
    registerGetters,
    state: b.state,
  };
}

function defineModule<
  S,
  M extends MutationsPayload,
  A extends ActionsPayload,
  G extends GettersPayload
>(
  name: string,
  state: S,
  { actions, mutations, getters }: { actions: A; mutations: M; getters: G }
): {
  getters: ReturnedGetters<G>;
  actions: ReturnedActions<A>;
  mutations: ReturnedMutations<M>;
  state: S;
} & SharedMutations<S>;
function defineModule<S, M extends MutationsPayload, A extends ActionsPayload>(
  name: string,
  state: S,
  { actions, mutations }: { actions: A; mutations: M }
): {
  actions: ReturnedActions<A>;
  mutations: ReturnedMutations<M>;
  state: S;
} & SharedMutations<S>;
function defineModule<S, M extends MutationsPayload, G extends GettersPayload>(
  name: string,
  state: S,
  { mutations, getters }: { mutations: M; getters: G }
): {
  getters: ReturnedGetters<G>;
  mutations: ReturnedMutations<M>;
  state: S;
} & SharedMutations<S>;
function defineModule<S, A extends ActionsPayload, G extends GettersPayload>(
  name: string,
  state: S,
  { actions, getters }: { actions: A; getters: G }
): {
  getters: ReturnedGetters<G>;
  actions: ReturnedActions<A>;
  state: S;
} & SharedMutations<S>;
function defineModule<S, M extends MutationsPayload>(
  name: string,
  state: S,
  { mutations }: { mutations: M }
): {
  mutations: ReturnedMutations<M>;
  state: S;
} & SharedMutations<S>;
function defineModule<S, A extends ActionsPayload>(
  name: string,
  state: S,
  { actions }: { actions: A }
): {
  actions: ReturnedActions<A>;
  state: S;
} & SharedMutations<S>;
function defineModule(name, state, vuexModule) {
  if (!vuexModule.mutations) vuexModule.mutations = {};
  const initialState = cloneDeep(state);
  vuexModule.mutations.resetState = moduleState => {
    Object.keys(initialState).map(key => {
      Vue.set(moduleState, key, initialState[key]);
    });
  };
  vuexModule.mutations.updateState = (moduleState, params) => {
    Object.keys(params).map(key => {
      Vue.set(moduleState, key, params[key]);
    });
  };
  vuexModule.mutations.updateListItem = (moduleState, { key, id, data }) => {
    const list = moduleState[key];
    const index = list.findIndex(f => f.id === id);
    const item = list.find(f => f.id === id);
    Vue.set(list, index, { ...item, ...data });
  };
  vuexModule.mutations.removeListItem = (moduleState, { key, id }) => {
    Vue.set(moduleState, key, moduleState[key].filter(f => f.id !== id));
  };
  vuexModule.mutations.addListItem = (moduleState, { key, data }) => {
    Vue.set(moduleState, key, moduleState[key].push(data));
  };
  vuexModule.mutations.concatList = (moduleState, { key, data }) => {
    Vue.set(moduleState, key, moduleState[key].concat(data));
  };
  if (module.hot) {
    enableHotReload(name, state, vuexModule);
  } else {
    storedModules[name] = {
      namespaced: true,
      state,
      ...vuexModule,
    };
  }

  const { registerGetters, registerMutations, registerActions, state: newState } = stateBuilder(
    state,
    name
  );

  return {
    mutations: registerMutations(vuexModule.mutations),
    actions: registerActions(vuexModule.actions),
    getters: registerGetters(vuexModule.getters),
    resetState() {
      storeBuilder.commit(`${name}/resetState`);
    },
    updateState(params) {
      storeBuilder.commit(`${name}/updateState`, params);
    },
    addListItem(key, data) {
      storeBuilder.commit(`${name}/updateListItem`, { key, data });
    },
    updateListItem(key, id, data) {
      storeBuilder.commit(`${name}/updateListItem`, { key, id, data });
    },
    removeListItem(key, id) {
      storeBuilder.commit(`${name}/removeListItem`, { key, id });
    },
    concatList(key, data) {
      storeBuilder.commit(`${name}/concatList`, { key, data });
    },
    get state() {
      return newState()();
    },
  } as any;
}

function createStore({ strict = false, ...options }: StoreOptions<any>) {
  storeBuilder = new Vuex.Store({
    strict,
    ...options,
    modules: storedModules,
  });
  storeBuilder.subscribeAction({
    before: (action, state) => {
      const moduleName = action.type.split('/')[0];
      const type = action.type.split('/')[1];
      console.groupCollapsed(
        `%c Vuex Action %c ${moduleName} %c ${type} %c`,
        'background: #451382 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
        'background:#fff;padding: 1px;color: #451382',
        'background:#2788d2;padding: 1px;border-radius: 0 3px 3px 0;color: #fff',
        'background:transparent'
      );
      console.log('PAYLOAD', action.payload);
      console.log('STATE', state);
      console.groupEnd();
    },
  });
  return storeBuilder;
}

export { storeBuilder, createStore, stateBuilder, defineModule, storedModules };
