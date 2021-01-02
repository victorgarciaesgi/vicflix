import Vue from 'vue';
import { Mixin } from 'vue-mixin-decorator';
import { Watch } from 'nuxt-property-decorator';
import { NavLink, TransitionDirection, TransitionType } from '@models';
import { Route } from 'vue-router';

function arrayContains<T>(data: T[], target: T[]): boolean {
  return data.every((f) => target.includes(f));
}

function clampAtFromName<T extends string | undefined>(routeName: T): T {
  if (routeName?.includes('@')) {
    const [block] = routeName.split('@');
    return `${block}index` as T;
  }
  return routeName as T;
}

function depthMapper(to: Route, from: Route, direction: TransitionDirection) {
  const toDepth = to.path.split('/').filter((f) => f.length > 0).length;
  const fromDepth = from.path.split('/').filter((f) => f.length > 0).length;
  return toDepth < fromDepth
    ? `slide-${direction === TransitionDirection.Horizontal ? 'right' : 'bottom'}`
    : `slide-${direction === TransitionDirection.Horizontal ? 'left' : 'top'}`;
}

@Mixin
export default class TransitionMixin extends Vue {
  public transitionName = 'slide-left';
  public listRoutes?: NavLink[];
  public transitionType: TransitionType = TransitionType.Depth;
  public transitionDirection: TransitionDirection = TransitionDirection.Horizontal;

  get transitionProps() {
    return {
      name: this.transitionName,
      mode: 'out-in',
    };
  }

  @Watch('$route') routeChanged(to: Route, from: Route) {
    if (this.transitionType === 'list' && this.listRoutes) {
      // const isComingFromList = this.listRoutes.find((f) => f.link?.name === from.name);
      const routes = this.listRoutes
        .map((route) => (typeof route.link === 'object' ? route.link?.name : null))
        .filter((f): f is string => !!f)
        .map((name) => clampAtFromName(name)) as string[];
      if (to.name && from?.name) {
        let toRouteName = clampAtFromName(to.name);
        let fromRouteName = clampAtFromName(from.name);

        if (arrayContains([toRouteName, fromRouteName], routes)) {
          const toRoute = to.matched.find((f) => clampAtFromName(f.name) === toRouteName);
          const fromRoute = from.matched.find((f) => clampAtFromName(f.name) === fromRouteName);

          if (toRoute?.name && fromRoute?.name) {
            if (
              routes.indexOf(clampAtFromName(toRoute.name)) <
              routes.indexOf(clampAtFromName(fromRoute.name))
            ) {
              this.transitionName = `slide-${
                this.transitionDirection === TransitionDirection.Horizontal ? 'right' : 'bottom'
              }`;
            } else {
              this.transitionName = `slide-${
                this.transitionDirection === TransitionDirection.Horizontal ? 'left' : 'top'
              }`;
            }
          } else {
            this.transitionName = 'fade';
          }
        } else {
          this.transitionName = depthMapper(to, from, this.transitionDirection);
        }
      } else {
        this.transitionName = 'fade';
      }
    } else if (this.transitionType === 'depth') {
      this.transitionName = depthMapper(to, from, this.transitionDirection);
    } else {
      this.transitionName = 'fade';
    }
  }
  created() {
    if (this.listRoutes) {
      this.transitionType = TransitionType.List;
    }
  }
}
