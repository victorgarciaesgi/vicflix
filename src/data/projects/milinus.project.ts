import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';
import { milinusVideos } from '../videos/milinus.videos';

export const milinusProject: Project = {
  picture: 'milinus.png',
  slogan: 'Le meilleur du fitness dans votre poche ! Prêt à decoller ?',
  description: '',
  title: 'Milinus',
  logo: 'milinus.svg',
  videos: Object.values(milinusVideos).flat(),
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
  type: [ProjectType.Mobile, ProjectType.App, ProjectType.Site],
  id: 'Tv7aAl',
  info: `Aucun lien ou accès d'application administrateur ne sera fourni.
    Toutes les vidéos sont issues de fausses données de test et ne correspondent pas à des vraies données client.
  `,
  technos: [
    TechnosList.Nuxt,
    TechnosList.Vue,
    TechnosList.Typescript,
    TechnosList.GraphQL,
    TechnosList.Tailwind,
  ],
  context: ProjectContext.Totem,
};
