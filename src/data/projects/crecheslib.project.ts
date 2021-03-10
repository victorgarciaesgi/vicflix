import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';
import { crecheslibVideos } from '../videos/crecheslib.videos';

export const crecheslibProject: Project = {
  picture: 'crecheslib.png',
  slogan: 'Des places en crèche en toute liberté !',
  description: '',
  title: "Crèches Lib'",
  logo: 'crecheslib.svg',
  videos: Object.values(crecheslibVideos).flat(),
  year: 2019,
  links: [
    {
      title: "Site client Crèches Lib'",
      link: 'https://crecheslib.com',
    },
  ],
  type: [ProjectType.App, ProjectType.Site],
  id: 'LJu8Bj',
  info: `Aucun lien ou accès d'application administrateur ne sera fourni.
    Toutes les vidéos sont issues de fausses données de test et ne correspondent pas à des vraies données client.
  `,
  technos: [
    TechnosList.Nuxt,
    TechnosList.Vue,
    TechnosList.Typescript,
    TechnosList.GraphQL,
    TechnosList.Leaflet,
  ],
  context: ProjectContext.Totem,
};
