import { VuexModule } from 'vuex-typed-modules';
import { Alerts } from '@constructors';
import { Route } from 'vue-router';

export interface IRouterState {
  currentRoute: Route | null;
  previousRoute: Route | null;
}

// State
const state: IRouterState = {
  currentRoute: null,
  previousRoute: null,
};

const getters = {
  currentRouteTitle({ currentRoute }: IRouterState): string | null {
    if (currentRoute) {
      const { length, [length - 1]: last } = currentRoute.meta;
      return last?.title;
    }
    return '';
  },
  previousRouteTitle({ previousRoute }: IRouterState): string | null {
    if (previousRoute) {
      const { length, [length - 1]: last } = previousRoute.meta;
      return last?.title;
    }
    return '';
  },
};

const actions = {
  updateCurrentRoute(ctx, route: Route) {
    const previousRoute = RouterModule.state.currentRoute;
    RouterModule.helpers.updateState({ currentRoute: route });
    RouterModule.helpers.updateState({ previousRoute });
  },
};

// Module
export const RouterModule = new VuexModule({
  name: 'RouterModule',
  state,
  getters,
  actions,
});
