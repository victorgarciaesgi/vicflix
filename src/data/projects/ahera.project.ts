import { TechnosList } from '@constants';
import { AppTrads, Project, ProjectContext, ProjectType } from '@models';

export const aheraProject: Project = {
  title: 'Ahera Admin app',
  id: 'mzkfzenf',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fahera%2Fahera_picture.png?alt=media&token=7665cfa6-0ee7-40a5-8051-7625f8aad2aa',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fahera%2Fbanner.png?alt=media&token=eb63dd8f-9346-4583-a500-2e26ade6d328',
  logo: 'ahera.svg',
  slogan: AppTrads.ProjectDescriptions.Ahera.Slogan,
  description: `Ahera Admin est une application permettant d'administrer le contenu et les utilisateurs des montre connectées Ahera.
  Elle consistait à réaliser une API et un back office administrateur

  Rôle: Lead développeur front

  Équipe: 1 développeur back, 1 développeur front, 1 développeur mobile
  `,
  duration: 2,
  videos: [],
  year: 2020,
  links: [
    {
      title: 'Site marketing Ahera Fitness',
      link: 'https://fr.aherafitness.com/',
    },
  ],
  type: [ProjectType.App, ProjectType.Mobile],
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
