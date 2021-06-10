import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';
import { crecheslibVideos } from '../videos/crecheslib.videos';

export const crecheslibProject: Project = {
  title: "Crèches Lib'",
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fcrecheslib%2Fcrecheslib.png?alt=media&token=faefa9a9-6133-40a0-a1d8-287c3e2fac65',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fcrecheslib%2Fcrecheslib_placeholder.png?alt=media&token=62be2d22-7dfd-4be2-8ea2-47c77e2c1637',
  slogan: 'Des places en crèche en toute liberté !',
  description: `Crèches Lib' est un projet comprenait un site d'achat ainsi qu'un back office administrateur et directeur.
  Le site d'achat permet aux client de s'inscrire, d'ajouter leurs enfants et de réserver des places en crèche dans toute la France.
  Le back office admin et directeur permet de traiter et d'accepter/refuser les demandes
  
  Ce projet permet entre autres à:
  - Réserver et payer une place en crèche (client)
  - Rechercher les places crèches disponible en France à l'aide d'une carte intéractive (client)
  - Accéder aux fiches descriptives des crèches (client)
  - Administrer et éditer les informations, places disponibles et créneaux des crèches (admin/directeur)
  - Bannir des utilisateurs (admin)
  - Consulter les résultats financier de sa crèche (directeur)

  Rôle: Développeur front

  Équipe: 1 développeur back, 1 développeur front
  `,
  duration: 12,
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
