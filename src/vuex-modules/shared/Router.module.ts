import { VuexModule } from 'vuex-typed-modules';
import { Route } from 'vue-router';
import { ObjectLiteral } from '@models';

export interface IRouterState {
  currentRoute: Route | null;
  previousRoute: Route | null;
  currentTitle: string;
}

// State
const state: IRouterState = {
  currentRoute: null,
  previousRoute: null,
  currentTitle: '',
};

// Module
export const RouterModule = new VuexModule({
  name: 'RouterModule',
  state,
  getters: {
    previousRouteTitle({ previousRoute }): string | null {
      if (previousRoute) {
        const [meta] = previousRoute.meta.filter((m: ObjectLiteral) => !!m.title);
        return meta?.title;
      }
      return '';
    },
  },
  actions: {
    updateCurrentRoute({ state }, route: Route) {
      const previousRoute = state.currentRoute;
      const [meta] = route.meta.filter((m: ObjectLiteral) => !!m.title);
      RouterModule.updateState(() => ({
        currentRoute: route,
        previousRoute,
        ...(meta?.title && {
          currentTitle: meta.title,
        }),
      }));
    },
  },
  logger: false,
});
