import Vue from 'vue';
import VueRouter from 'vue-router';
import { routesList, routesNames } from './routes';
import { MyRoute } from './routes.models';
import { EventBus, Events } from '@services';
import { ProgressBarModule, AlertsModule, UserModule } from '../store';
import { WarningNotification } from '@constructors';
import { routerLogger } from './router.logger';
import { oc } from 'ts-optchain';

Vue.use(VueRouter);
const SITE_NAME = process.env.VUE_APP_NAME;

const Router = new VueRouter({
  mode: 'history',
  fallback: false,
  async scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes: routesList,
});

Router.beforeEach(async (to: MyRoute, from: MyRoute, next) => {
  try {
    routerLogger(to, from);

    if (!UserModule.state.authChecked) {
      await UserModule.actions.checkUserSession();
    }
    ProgressBarModule.mutations.start('progress');

    if (to.matched.some(m => m.meta.requiresAuth)) {
      if (!UserModule.state.loggedIn) {
        next({ name: routesNames.WHOAMI });
      }
      if (to.matched.some(s => !!s.meta.asyncData)) {
        await getRouteData(to, from);
      }
    } else if (to.matched.some(m => m.meta.noAuth) && UserModule.state.loggedIn) {
      UserModule.actions.disconnectRequest();
    } else {
      if (to.matched.some(s => !!s.meta.asyncData)) {
        await getRouteData(to, from);
      }
    }
    next();
  } catch (err) {
    ProgressBarModule.mutations.fail();
    ProgressBarModule.mutations.hide();
    console.log(err);
  }

  if (!to.meta.contentTitle || Object.keys(to.params).every(m => !to.params[m])) {
    makePageTitle(to.meta.title);
  }
  next();
});

Router.afterEach(async (to: MyRoute, from: MyRoute) => {
  if (AlertsModule.state.alertShow) AlertsModule.mutations.hideAlert();
  EventBus.$emit(Events.CLOSE_POPUPS);
  ProgressBarModule.mutations.finish();
  ProgressBarModule.mutations.hide();
});

const getRouteData = async (to: MyRoute, from: MyRoute) => {
  const results = await Promise.all(
    to.matched
      .filter(f => !!f.meta.asyncData)
      .filter(f => !from.matched.find(p => p.path == f.path))
      .map(m => {
        return m.meta.asyncData(to);
      })
  );
  if (to.meta.contentTitle) {
    makePageTitle(results[results.length - 1] || to.meta.title);
  }
};

const makePageTitle = (title: string) => {
  if (!!title) {
    document.title = `${title} - ${SITE_NAME}`;
  } else {
    document.title = SITE_NAME;
  }
};

export default Router;
