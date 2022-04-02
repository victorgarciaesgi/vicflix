import { TechnosList } from '@constants';
import { AppTrads, Project, ProjectContext, ProjectType } from '@models';
import { profeelVideos } from '../videos/profeel.videos';

export const profeelProject: Project = {
  title: 'Profeel App & Admin',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fprofeel%2Fprofeel.png?alt=media&token=394ffa85-6ea8-4c70-9d85-4650edbc82d5',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fprofeel%2Fprofeel_placeholder.png?alt=media&token=7cff975f-1c9b-4d19-b74f-e692a3c366de',
  slogan: AppTrads.ProjectDescriptions.Profeel.Slogan,
  description: `Profeel est un programme CheckReno permettant de gérer les fiches d'autocontrôles de chantiers.
  Il consistait à realiser une API, un back-office administrateur, une app web client, une application mobile et un site vitrine.

  Ce projet permettait entre autres à :
  - Inscrire sa société avec son numéro de Siret
  - Ajouter d'autre utilsateurs à sa société avec une gestion de rôles
  - Créer les fiches de chantier et pouvoir générer les pdf de fiches d'autocontrôles et de réceptions
  - Télécharger, uploader les documents pour chaque point de contrôles triés par localisation
  
  Rôle: Lead developpeur front

  Équipe: 2 developpeurs back, 2 developpeurs front, 2 developpeurs mobile
  `,
  logo: 'profeel.png',
  videos: Object.values(profeelVideos).flat(),
  duration: 6,
  year: 2021,
  links: [
    {
      title: 'Site client Profeel',
      link: 'https://compte.checkreno.fr/',
    },
    {
      title: 'Application Profeel iOS',
      link: 'https://apps.apple.com/fr/app/checkr%C3%A9no/id1538147023',
    },
    {
      title: 'Application Profeel iOS',
      link: 'https://play.google.com/store/apps/details?id=com.qualiteconstruction.checkreno&hl=fr&gl=US',
    },
  ],
  type: [ProjectType.App, ProjectType.Mobile],
  id: 'LAtFkd',
  info: AppTrads.Projects.InfoWarning,
  technos: [
    TechnosList.Nuxt,
    TechnosList.Vue,
    TechnosList.Typescript,
    TechnosList.GraphQL,
    TechnosList.Tailwind,
    TechnosList.Chartjs,
    TechnosList.Gitlab,
  ],
  context: ProjectContext.Totem,
};
