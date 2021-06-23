import { TechnosList } from '@constants';
import { AppTrads, Project, ProjectContext, ProjectType } from '@models';

export const crecheslibProject: Project = {
  title: "Crèches Lib'",
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fcrecheslib%2Fcrecheslib.png?alt=media&token=faefa9a9-6133-40a0-a1d8-287c3e2fac65',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fcrecheslib%2Fcrecheslib_placeholder.png?alt=media&token=17c04bb7-264b-4267-baa1-d32d57a741cc',
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

  Équipe: 1 développeur back, 1 développeur front`,
  duration: 12,
  logo: 'crecheslib.svg',
  videos: [],
  year: 2019,
  links: [
    {
      title: "Site client Crèches Lib'",
      link: 'https://www.crecheslib.com',
    },
  ],
  type: [ProjectType.App, ProjectType.Site],
  id: 'LJu8Bj',
  info: AppTrads.Projects.InfoWarning,
  technos: [
    TechnosList.Nuxt,
    TechnosList.Vue,
    TechnosList.Typescript,
    TechnosList.GraphQL,
    TechnosList.MapBox,
    TechnosList.Leaflet,
    TechnosList.Chartjs,
    TechnosList.Gitlab,
  ],
  context: ProjectContext.Totem,
};
