import { Project, ProjectType } from '@models';
import { nanoid } from 'nanoid';
import { TechnosList } from './technos.constant';

export const milinusProject: Project = {
  picture: 'milinus.png',
  description: 'Le meilleur du fitness dans votre poche ! Prêt à decoller ?',
  title: 'Milinus',
  logo: 'milinus.svg',
  videos: [
    {
      id: nanoid(6),
      title: "Présentation de l'application",
      description:
        "Victor nous fait découvrir l'application Milinus Admin, mais il se passe quelque chose d'imprévu...",
      duration: 4,
      episode: 1,
      preview:
        'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Video%20previews%2Fmilinus.png?alt=media&token=43b008f7-e36f-4493-8b32-e22df115aa92',
    },
  ],
  year: 2020,
  links: [
    {
      title: 'Site Milinus',
      link: 'https://www.milinus.com',
    },
    {
      title: 'Application Milinus iOS',
      link: 'https://apps.apple.com/us/app/milinus/id1506570411',
    },
  ],
  type: ProjectType.App,
  id: nanoid(6),
  technos: [
    TechnosList.Nuxt,
    TechnosList.Vue,
    TechnosList.Typescript,
    TechnosList.GraphQL,
    TechnosList.Tailwind,
  ],
};

export const allProjects = [milinusProject];

export const featuredProject: Project[] = [
  milinusProject,
  milinusProject,
  milinusProject,
  milinusProject,
  milinusProject,
  milinusProject,
  milinusProject,
  milinusProject,
];
