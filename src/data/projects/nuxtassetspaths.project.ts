import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';

export const nuxtAssetsPathsProject: Project = {
  title: 'nuxt-assets-paths',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fnuxt-assets-paths%2Fnuxt-assets-paths.png?alt=media&token=c5df1182-6c30-4179-ae31-21540e614bbf',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fnuxt-assets-paths%2Fnuxt-assets-paths.png?alt=media&token=c5df1182-6c30-4179-ae31-21540e614bbf',
  slogan: '🌆 🖇 Autocomplete for nuxt assets, icons and images paths',
  description: `Generate icon paths objects and Typescript interface for your assets and static files`,
  logo: 'github.png',
  videos: [],
  year: 2021,
  links: [
    {
      title: 'Github homepage',
      link: 'https://github.com/victorgarciaesgi/nuxt-assets-paths',
    },
  ],
  badges: [
    {
      img: 'https://img.shields.io/npm/v/nuxt-assets-paths.svg',
      link: 'https://www.npmjs.com/package/nuxt-assets-paths',
    },
    {
      img: 'https://img.shields.io/npm/dm/nuxt-assets-paths.svg',
      link: 'https://www.npmjs.com/package/nuxt-assets-paths',
    },
    {
      img: 'https://img.shields.io/npm/dt/nuxt-assets-paths.svg',
      link: 'https://www.npmjs.com/package/nuxt-assets-paths',
    },
    {
      img: 'https://img.shields.io/npm/l/nuxt-assets-paths.svg',
    },
  ],
  type: [ProjectType.Library],
  id: 'EPONbdlks',
  technos: [TechnosList.Typescript, TechnosList.Nuxt],
  context: ProjectContext.Personal,
};
