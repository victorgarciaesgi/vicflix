import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';

export const rewindProject: Project = {
  title: 'Rewind Admin app',
  id: 'iojzpfjp',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Frewind%2Frewinnnd.png?alt=media&token=14f63c10-8db2-4431-b5d2-8f7b1de9e363',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Frewind%2FHomepage-1.jpg?alt=media&token=08024aeb-8a66-4e84-a36e-c04091e319cd',
  logo: 'rewind.png',
  slogan: 'Visites audio-guidées pour voyageurs & locaux',
  description: '',
  videos: [],
  year: 2019,
  links: [
    {
      title: 'Site marketing Rewind',
      link: 'https://rewindstories.com',
    },
  ],
  type: [ProjectType.App, ProjectType.Mobile],
  info: `Aucun lien ou accès d'application administrateur ne sera fourni.
    Toutes les vidéos sont issues de fausses données de test et ne correspondent pas à des vraies données client.
  `,
  technos: [TechnosList.Vue, TechnosList.Typescript, TechnosList.GraphQL, TechnosList.Leaflet],
  context: ProjectContext.Totem,
};
