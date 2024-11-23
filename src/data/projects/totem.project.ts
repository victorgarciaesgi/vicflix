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
  description: `Ce projet est la refonte du site de mon entreprise Totem.
  En collaboration avec les UX/UI de Totem, nous avons mis en place un design moderne et élégant qui allait nous permettre d'attirer plus de clients.
  
  Rôle: Développeur front
  
  Équipe: 1 développeur front`,
  year: 2020,
  duration: 3,
  links: [
    {
      title: 'Site client Totem Paris',
      link: 'https://totem.paris/',
    },
  ],
  type: [ProjectType.Site],
  technos: [TechnosList.React, TechnosList.Gatsby, TechnosList.Tailwind, TechnosList.GraphQL],
  context: ProjectContext.Totem,
};
