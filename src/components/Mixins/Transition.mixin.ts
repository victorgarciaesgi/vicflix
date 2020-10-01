import Vue from 'vue';
import { Mixin } from 'vue-mixin-decorator';
import { Watch } from 'nuxt-property-decorator';
import { navRoutes, NavLink } from '@models';
import { RouteRecord, Route } from 'vue-router';

const arrayContains = <T>(data: T[], target: T[]): boolean => {
  return data.every((f) => target.includes(f));
};

const depthMapper = (to: Route, from: Route) => {
  const toDepth = to.path.split('/').filter((f) => f.length > 0).length;
  const fromDepth = from.path.split('/').filter((f) => f.length > 0).length;
  return toDepth < fromDepth ? 'slide-right' : 'slide-left';
};

@Mixin
export default class TransitionMixin extends Vue {
  public transitionName = 'slide-left';
  public listRoutes?: NavLink[];
  public transitionType: 'depth' | 'list' = 'depth';

  @Watch('$route') routeChanged(to: Route, from: Route) {
    if (this.transitionType === 'list' && this.listRoutes) {
      const routes = this.listRoutes.map((m) => m.link?.name).filter((f) => !!f) as string[];
      if (to.name && from && from.name) {
        if (arrayContains([to.name, from.name], routes)) {
          const toRoute = to.matched.find((f) => f.name);
          const fromRoute = from.matched.find((f) => f.name);
          if (toRoute && fromRoute) {
            if (routes.indexOf(to.name) < routes.indexOf(from.name)) {
              this.transitionName = 'slide-right';
            } else {
              this.transitionName = 'slide-left';
            }
          } else {
            this.transitionName = 'fade';
          }
        } else {
          this.transitionName = depthMapper(to, from);
        }
      } else {
        this.transitionName = 'fade';
      }
    } else if (this.transitionType === 'depth') {
      this.transitionName = depthMapper(to, from);
    } else {
      this.transitionName = 'fade';
    }
  }
}
