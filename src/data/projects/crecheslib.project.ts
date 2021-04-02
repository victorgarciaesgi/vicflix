import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';
import { crecheslibVideos } from '../videos/crecheslib.videos';

export const crecheslibProject: Project = {
  title: "Crèches Lib'",
  slogan: 'Des places en crèche en toute liberté !',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fcrecheslib%2Fcrecheslib.png?alt=media&token=faefa9a9-6133-40a0-a1d8-287c3e2fac65',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fcrecheslib%2Fcrecheslib_placeholder.png?alt=media&token=62be2d22-7dfd-4be2-8ea2-47c77e2c1637',
  description: '',
  logo: 'crecheslib.svg',
  videos: Object.values(crecheslibVideos).flat(),
  year: 2019,
  links: [
    {
      title: "Site client Crèches Lib'",
      link: 'https://www.crecheslib.com',
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
    TechnosList.MapBox,
    TechnosList.Leaflet,
    TechnosList.Gitlab,
  ],
  context: ProjectContext.Totem,
};
