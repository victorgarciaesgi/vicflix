import { TechnosList } from '@constants';
import { Project, ProjectType } from '@models';
import { bigupVideos } from '../videos';

export const bigupProject: Project = {
  id: 'PN9kzl',
  picture: 'bigup.png',
  slogan: 'Demande des dédicaces vidéos à tes célébrités préférées',
  description: '',
  title: 'Big Up',
  logo: 'bigup.png',
  videos: Object.values(bigupVideos).flat(),
  year: 2021,
  links: [
    {
      title: 'Site client Big Up',
      link: 'https://bigupvideo.com',
    },
  ],
  type: [ProjectType.App, ProjectType.Site, ProjectType.Mobile],
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
};
