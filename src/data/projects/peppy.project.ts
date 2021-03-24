import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';

export const peppyProject: Project = {
  title: 'Peppy Pro',
  id: 'BJlhzjef',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fpeppy%2FScreenshot%20at%20Mar%2023%2013-59-06.png?alt=media&token=4235c11c-42ca-4e96-893e-99f6e6ec90d6',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fpeppy%2Fbckg_site%20(1).jpg?alt=media&token=7898f0d2-cba3-40ea-b799-f5af4a89d026',
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
  type: [ProjectType.App, ProjectType.Site, ProjectType.Mobile],
  info: `Aucun lien ou accès d'application administrateur ne sera fourni.
    Toutes les vidéos sont issues de fausses données de test et ne correspondent pas à des vraies données client.
  `,
  technos: [TechnosList.Vue, TechnosList.Typescript, TechnosList.GraphQL, TechnosList.Stripe],
  context: ProjectContext.Totem,
};
