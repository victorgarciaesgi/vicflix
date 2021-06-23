import { TechnosList } from '@constants';
import { AppTrads, Project, ProjectContext, ProjectType } from '@models';

export const bigupProject: Project = {
  title: 'Big Up website & Admin',
  id: 'PN9kzl',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fbigup%2Fbigup.png?alt=media&token=77a58603-d223-42a5-99d1-5fe30f06371b',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fbigup%2Fbigup_placeholder.png?alt=media&token=fafbb4e5-5ce3-47e3-ac22-182abd533758',
  logo: 'bigup.png',
  slogan: AppTrads.ProjectDescriptions.Bigup.Slogan,
  description: `Big up est mon premier projet réalisé chez Totem Paris.
  Il consistait à réaliser une API, un site d'achat, un back office administrateur et une application mobile.
  
  Ce projet permettait entre autres à :
  - Acheter une vidéo à un influenceur (site)
  - Télécharger sa vidéo depuis le site (site)
  - Naviguer parmis les artistes disponibles (site)
  - Administrer les artistes ainsi que les demandes de vidéos effectuées (admin)
  - Lier les comptes Stripe des artistes (admin)
  - Les artistes pouvaient recevoir les demandes de clients et enregistrer les vidéos (mobile)
  `,
  duration: 3,
  videos: [],
  year: 2018,
  links: [
    {
      title: 'Site client Big Up',
      link: 'https://www.bigupvideo.com/',
    },
  ],
  type: [ProjectType.App, ProjectType.Site, ProjectType.Mobile],
  info: AppTrads.Projects.InfoWarning,
  technos: [TechnosList.Vue, TechnosList.Typescript, TechnosList.GraphQL, TechnosList.Stripe],
  context: ProjectContext.Totem,
};
