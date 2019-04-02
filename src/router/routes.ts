import { MyRouteConfig } from './routes.models';

// Liste d'identifiants des routes
export const routesNames = {
  BROWSE: 'browse',
  WHOAMI: 'whoami',
};

function loadView(view: string) {
  return () => import(/* webpackChunkName: "view-[request]" */ `@views/${view}.vue`);
}

// Liste des routes
export const routesList: MyRouteConfig[] = [
  {
    path: '/',
    component: loadView('WhoAmi'),
    name: routesNames.WHOAMI,
    meta: {
      title: 'Qui est-ce?',
      noAuth: true,
    },
  },
  {
    path: '/browse',
    component: loadView('BaseApp'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: routesNames.BROWSE,
        meta: {
          title: 'Browse',
        },
        component: loadView('Browse'),
      },
    ],
  },

  {
    path: '/*',
    meta: {
      title: 'Page non trouvée',
    },
    beforeEnter(to, from, next) {
      next('/');
    },
  },
];
