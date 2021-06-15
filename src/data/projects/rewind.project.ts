import { TechnosList } from '@constants';
import { AppTrads, Project, ProjectContext, ProjectType } from '@models';

export const rewindProject: Project = {
  title: 'Rewind Admin app',
  id: 'iojzpfjp',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Frewind%2FHomepage-1.jpg?alt=media&token=1ee64457-5db4-4973-aba1-43fc4b664a31',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Frewind%2FHomepage-1.jpg?alt=media&token=1ee64457-5db4-4973-aba1-43fc4b664a31',
  logo: 'rewind.png',
  slogan: 'Visites audio-guidées pour voyageurs & locaux',
  description: '',
  videos: [],
  year: 2019,
  duration: 2,
  links: [
    {
      title: 'Site marketing Rewind',
      link: 'https://rewindstories.com',
    },
  ],
  type: [ProjectType.App, ProjectType.Mobile],
  info: AppTrads.Projects.InfoWarning,
  technos: [
    TechnosList.Vue,
    TechnosList.Typescript,
    TechnosList.GraphQL,
    TechnosList.MapBox,
    TechnosList.Leaflet,
    TechnosList.Gitlab,
  ],
  context: ProjectContext.Totem,
};
