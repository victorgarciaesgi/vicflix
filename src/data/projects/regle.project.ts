import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';

export const regleProject: Project = {
  title: 'regle',
  picture:
    'https://raw.githubusercontent.com/victorgarciaesgi/regle/refs/heads/main/.github/images/regle-github-banner.png',
  placeholder:
    'https://raw.githubusercontent.com/victorgarciaesgi/regle/refs/heads/main/.github/images/regle-github-banner.png',
  slogan: '📏 Typescript-first model-based form validation library for Vue 3',
  description: `Regle (French word for "rule") is a Typescript-first form validation library made for Vue 3.
I'm a lover and long-time user of Vuelidate API, so Regle's is greatly inspired by it.

Regle is about bringing type safety and great DX to simple or complex Form.
It's all data-based and headless, the validation matches the data structure so you can separate UI and validations.

Declare your form rules inside a component or a Pinia store and use it wherever you like.
  `,
  logo: 'github.png',
  videos: [],
  year: 2024,
  links: [
    {
      title: 'Github homepage',
      link: 'https://github.com/victorgarciaesgi/regle',
    },
  ],
  badges: [
    {
      img: 'https://img.shields.io/npm/v/@regle/core.svg',
      link: 'https://www.npmjs.com/package/@regle/core',
    },
    {
      img: 'https://img.shields.io/npm/dm/@regle/core.svg',
      link: 'https://www.npmjs.com/package/@regle/core',
    },
    {
      img: 'https://img.shields.io/npm/dt/@regle/core.svg',
      link: 'https://www.npmjs.com/package/@regle/core',
    },
    {
      img: 'https://img.shields.io/npm/l/@regle/core.svg',
    },
  ],
  type: [ProjectType.Library],
  id: 'VjLD93nK',
  technos: [TechnosList.Typescript, TechnosList.Vue, TechnosList.Nuxt],
  context: ProjectContext.Personal,
};
