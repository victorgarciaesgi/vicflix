import { Project } from '@models';
import { TechnosList } from './technos.constant';

export const milinusProject: Project = {
  picture: 'milinus.png',
  description: 'Le meilleur du fitness dans votre poche ! Prêt à decoller ?',
  title: 'Milinus',
  logo: 'milinus.svg',
  videoLink: '',
  year: 2020,
  link: 'https://www.milinus.com',
  technos: [
    TechnosList.Nuxt,
    TechnosList.Vue,
    TechnosList.Typescript,
    TechnosList.GraphQL,
    TechnosList.Tailwind,
  ],
};

export const featuredProject: Project[] = [
  milinusProject,
  milinusProject,
  milinusProject,
  milinusProject,
  milinusProject,
  milinusProject,
  milinusProject,
  milinusProject,
];
