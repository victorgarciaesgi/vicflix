import { TechnosList } from '@constants';
import { AppTrads, Project, ProjectContext, ProjectType } from '@models';

export const peppyProject: Project = {
  title: 'Peppy Pro',
  id: 'BJlhzjef',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fpeppy%2Fbckg_site%20(1).jpg?alt=media&token=7898f0d2-cba3-40ea-b799-f5af4a89d026',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fpeppy%2Fpeppy.png?alt=media&token=ed22b74d-4b7a-41ee-961f-d7329201c904',
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
  info: AppTrads.Projects.InfoWarning,
  technos: [
    TechnosList.Vue,
    TechnosList.Typescript,
    TechnosList.GraphQL,
    TechnosList.Stripe,
    TechnosList.Gitlab,
  ],
  context: ProjectContext.Totem,
};
