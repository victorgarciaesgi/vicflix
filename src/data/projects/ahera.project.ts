import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';

export const aheraProject: Project = {
  title: 'Ahera Admin app',
  id: 'mzkfzenf',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fahera%2Fahera_picture.png?alt=media&token=7665cfa6-0ee7-40a5-8051-7625f8aad2aa',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fahera%2F965240_56a7b38e2d9d4235994c2bee9c4dec22_mv2.png?alt=media&token=21e6b7f2-b1b3-4a16-9fe5-7c1a1d33879a',
  logo: 'ahera.svg',
  slogan: 'Votre expérience fitness à 360°',
  description: '',
  videos: [],
  year: 2020,
  links: [
    {
      title: 'Site marketing Ahera Fitness',
      link: 'https://fr.aherafitness.com/',
    },
  ],
  type: [ProjectType.App, ProjectType.Mobile],
  info: `Aucun lien ou accès d'application administrateur ne sera fourni.
    Toutes les vidéos sont issues de fausses données de test et ne correspondent pas à des vraies données client.
  `,
  technos: [
    TechnosList.Nuxt,
    TechnosList.Vue,
    TechnosList.Typescript,
    TechnosList.GraphQL,
    TechnosList.Tailwind,
    TechnosList.Gitlab,
  ],
  context: ProjectContext.Totem,
};
