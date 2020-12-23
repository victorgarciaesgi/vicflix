import { Middleware, Plugin } from '@nuxt/types';
import { EventBus, Events } from '@services';
import { AuthModule, RouterModule } from '@store';
import { Route } from 'vue-router';
import colorsModule from '@colors';

interface MetaOptions {
  hideHeader: boolean;
  indexable: boolean;
  disconnect: boolean;
}

const routerLogger = (to: Route, from: Route) => {
  const toRoute = to.name ?? to.path;
  const fromRoute = from?.name ?? from?.path;

  console.groupCollapsed(
    `%c Router log %c To:%c[${toRoute}]`,
    'background: #42b983 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
    'background:#fff;padding: 1px;color: #000',
    `background:#fff;padding: 1px;color: ${colorsModule.blue}`
  );
  console.log('TO', to);
  console.log('FROM', from);
  console.groupEnd();
};

const routePlugin: Middleware = ({ route, app, from }) => {
  if (process.browser) {
    routerLogger(route, from);
    if (route.meta.some((m: MetaOptions) => m.disconnect)) {
      AuthModule.actions.disconnectUser();
    }
  }
  if (route.fullPath === from?.fullPath) {
    if (!route.meta.some((m: MetaOptions) => m.indexable === false)) {
      RouterModule.actions.updateCurrentRoute(route);
    }
  } else if (app.router) {
    if (!RouterModule.state.currentTitle) {
      RouterModule.actions.updateCurrentRoute(route);
    }
    const afterEachHook = app.router.afterEach(() => {
      if (!route.meta.some((m: MetaOptions) => m.indexable === false)) {
        RouterModule.actions.updateCurrentRoute(route);
      }
      afterEachHook();
    });
  }
  EventBus.$emit(Events.CLOSE_POPUPS);
};

export default routePlugin;
