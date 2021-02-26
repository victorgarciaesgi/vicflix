import { TechnosList } from '@constants';
import { Project, ProjectType } from '@models';
import * as videos from '../videos/milinus.videos';
export const milinusProject: Project = {
  picture: 'milinus.png',
  description: 'Le meilleur du fitness dans votre poche ! Prêt à decoller ?',
  title: 'Milinus',
  logo: 'milinus.svg',
  videos: Object.values(videos),
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
  id: 'Tv7aAl',
  technos: [
    TechnosList.Nuxt,
    TechnosList.Vue,
    TechnosList.Typescript,
    TechnosList.GraphQL,
    TechnosList.Tailwind,
  ],
};
