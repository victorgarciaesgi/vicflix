import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';

export const nuxtTypeRouterProject: Project = {
  title: 'nuxt-typed-router',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fnuxt-typed-router%2Fcover.png?alt=media&token=743786cf-dd00-4653-bbdb-c7d9870f92f5',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fnuxt-typed-router%2Fcover.png?alt=media&token=743786cf-dd00-4653-bbdb-c7d9870f92f5',
  slogan: '🚦Provide autocompletion for pages route names and params in Nuxt apps',
  description: `Provide a type safe router to Nuxt with auto-generated typed definitions for route names and autocompletion for route params.

  - NuxtLink route autocomplete and params type-check
  - useRouter and useRoute route autocomplete and params type-check
  - Supports optional params and catchAll routes
  - Infer route params based on route name
  - Supports routes defined in config.extendRoutes
  `,
  logo: 'github.png',
  videos: [],
  year: 2019,
  links: [
    {
      title: 'Github homepage',
      link: 'https://github.com/victorgarciaesgi/nuxt-typed-router',
    },
  ],
  badges: [
    {
      img: 'https://img.shields.io/npm/v/nuxt-typed-router.svg',
      link: 'https://www.npmjs.com/package/nuxt-typed-router',
    },
    {
      img: 'https://img.shields.io/npm/dm/nuxt-typed-router.svg',
      link: 'https://www.npmjs.com/package/nuxt-typed-router',
    },
    {
      img: 'https://img.shields.io/npm/dt/nuxt-typed-router.svg',
      link: 'https://www.npmjs.com/package/nuxt-typed-router',
    },
    {
      img: 'https://img.shields.io/npm/l/nuxt-typed-router.svg',
    },
  ],
  type: [ProjectType.Library],
  id: 'VNVlnnlz',
  technos: [TechnosList.Typescript, TechnosList.Nuxt],
  context: ProjectContext.Personal,
};
