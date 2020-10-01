import { Middleware, Plugin } from '@nuxt/types';
import { EventBus, Events } from '@services';
import { AuthModule, RouterModule } from '@store';
import { Route } from 'vue-router';
import Vue from 'vue';

const routerLogger = (to: Route, from: Route) => {
  const toRoute = to.name ?? to.path;
  const fromRoute = from?.name ?? from?.path;

  console.groupCollapsed(
    `%c Router log %c To:%c[${toRoute}] %c, From:%c[${fromRoute}] %c`,
    'background: #42b983 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
    'background:#fff;padding: 1px;color: #000',
    'background:#fff;padding: 1px;color: #198c1d',
    'background:#fff;padding: 1px;color: #000',
    'background:#fff;padding: 1px;border-radius: 0 3px 3px 0;color: #a06711',
    'background:transparent'
  );
  console.log('TO', to);
  console.log('FROM', from);
  console.groupEnd();
};

const checkRoute = (route: Route) => {
  if (route.meta.some((m) => m.noHeader)) {
    AuthModule.helpers.updateState({
      hideHeader: true,
    });
  } else {
    AuthModule.helpers.updateState({
      hideHeader: false,
    });
  }
};

const routePlugin: Middleware = ({ route, app, from }) => {
  routerLogger(route, from);

  if (from.name === route.name) {
    checkRoute(route);
  } else if (app.router) {
    const afterEachHook = app.router.afterEach((to, from) => {
      Vue.nextTick(() => {
        checkRoute(route);
        RouterModule.actions.updateCurrentRoute(route);
        afterEachHook();
      });
    });
    EventBus.$emit(Events.CLOSE_POPUPS);
  } else {
    checkRoute(route);
  }
};

export default routePlugin;
