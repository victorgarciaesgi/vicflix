import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';

export const totemProject: Project = {
  title: 'Totem Paris',
  id: 'jzoybBjn',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Ftotem%2Ftotem.png?alt=media&token=17a35f36-68e6-44f2-80d8-4d50f5695436',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Ftotem%2Ftotemhome%20(1).png?alt=media&token=ad72a160-06ad-4b59-813b-454044f225f0',
  logo: 'totem.svg',
  slogan: 'Agence de développement web et mobile',
  videos: [],
  description: '',
  year: 2020,
  links: [
    {
      title: 'Site client Totem Paris',
      link: 'https://totem.paris/',
    },
  ],
  type: [ProjectType.Site],
  technos: [
    TechnosList.React,
    TechnosList.Gatsby,
    TechnosList.Tailwind,
    TechnosList.GraphQL,
    TechnosList.Netlify,
  ],
  context: ProjectContext.Totem,
};
