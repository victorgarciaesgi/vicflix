import { MyRouteConfig } from './routes.models';

// Liste d'identifiants des routes
export const routesNames = {
  BROWSE: 'browse',
  WHOAMI: 'whoami',
  ABOUT: 'aboutme',
  PROJECTS: 'projects',
  SKILLS: 'skills',
  EXPERIENCE: 'experience',
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
        component: loadView('Pages/Browse'),
      },
      {
        path: '/about',
        name: routesNames.ABOUT,
        meta: {
          title: 'About me',
        },
        component: loadView('Pages/AboutMe'),
      },
      {
        path: '/projects',
        name: routesNames.PROJECTS,
        meta: {
          title: 'Browse',
        },
        component: loadView('Pages/Projects'),
      },
      {
        path: '/skills',
        name: routesNames.SKILLS,
        meta: {
          title: 'Skills',
        },
        component: loadView('Pages/Skills'),
      },
      {
        path: '/experience',
        name: routesNames.EXPERIENCE,
        meta: {
          title: 'Skills',
        },
        component: loadView('Pages/Skills'),
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
