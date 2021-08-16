import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';

export const vueChart3Project: Project = {
  title: 'vue-chart-3',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fvue-chart-3%2Fvue-chart-3.png?alt=media&token=8780ec4a-2f45-4e90-a88c-7ebb84272742',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fvue-chart-3%2Fvue-chart-3.png?alt=media&token=8780ec4a-2f45-4e90-a88c-7ebb84272742',
  slogan: '📊 A simple wrapper around Chart.js 3 for Vue 2 & 3',
  description: `This package is a rewrite of vue-chartjs for Chart.js 3, but written in Typescript with vue-demi and Vue Composition API.
  It's actually my most popular open source project and i'm maintaining it actively and have a lot of feedback!`,
  logo: 'vue-chart-3.svg',
  videos: [],
  year: 2021,
  links: [
    {
      title: 'Github homepage',
      link: 'https://github.com/victorgarciaesgi/vue-chart-3',
    },
    {
      title: 'Documentation',
      link: 'https://vue-chart-3.netlify.app/',
    },
  ],
  badges: [
    {
      img: 'https://img.shields.io/npm/v/vue-chart-3.svg',
      link: 'https://www.npmjs.com/package/vue-chart-3',
    },
    {
      img: 'https://img.shields.io/npm/dm/vue-chart-3.svg',
      link: 'https://www.npmjs.com/package/vue-chart-3',
    },
    {
      img: 'https://img.shields.io/npm/dt/vue-chart-3.svg',
      link: 'https://www.npmjs.com/package/vue-chart-3',
    },
    {
      img: 'https://img.shields.io/npm/l/vue-chart-3.svg',
    },
  ],
  type: [ProjectType.Library],
  id: 'PuNNEkbnLo',
  technos: [
    TechnosList.Typescript,
    TechnosList.Vue,
    TechnosList.Chartjs,
    TechnosList.VuePress,
    TechnosList.Karma,
    TechnosList.Jasmine,
  ],
  context: ProjectContext.Personal,
};
