import { RouteConfig, Route, RouteRecord } from 'vue-router/types';

export interface MyMeta {
  title?: string;
  requiresAuth?: boolean;
  contentTitle?: boolean;
  noAuth?: boolean;
  asyncData?: (to?: MyRoute | MyRouteRecord) => Promise<string | void>;
  isAuthorized?: (to?: any) => boolean;
}

export interface MyRoute extends Route {
  meta: MyMeta;
  matched: MyRouteRecord[];
}

export interface MyRouteRecord extends RouteRecord {
  meta: MyMeta;
}

export interface MyRouteConfig extends RouteConfig {
  children?: MyRouteConfig[];
  meta?: MyMeta;
}
