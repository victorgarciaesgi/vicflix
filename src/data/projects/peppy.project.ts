import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';

export const peppyProject: Project = {
  title: 'Peppy Pro',
  id: 'BJlhzjef',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fpeppy%2Fbckg_site%20(1).jpg?alt=media&token=7898f0d2-cba3-40ea-b799-f5af4a89d026',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fpeppy%2Fpeppy.png?alt=media&token=1570d6fe-37b5-419c-a983-0f648a5b79d8',
  logo: 'peppy.png',
  slogan: 'Simplement plus facile !',
  description: '',
  videos: [],
  year: 2018,
  links: [
    {
      title: 'Site marketing Peppy',
      link: 'https://peppy-group.com/',
    },
  ],
  type: [ProjectType.App, ProjectType.Mobile],
  info: `Aucun lien ou accès d'application administrateur ne sera fourni.
    Toutes les vidéos sont issues de fausses données de test et ne correspondent pas à des vraies données client.
  `,
  technos: [TechnosList.Vue, TechnosList.Typescript, TechnosList.GraphQL, TechnosList.Stripe],
  context: ProjectContext.Totem,
};
