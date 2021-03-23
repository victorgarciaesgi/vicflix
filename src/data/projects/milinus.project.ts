import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';
import { milinusVideos } from '../videos/milinus.videos';

export const milinusProject: Project = {
  title: 'Milinus Admin',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fmilinus%2Fmilinus.png?alt=media&token=38b19775-622c-46fb-85d5-763e16190983',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fmilinus%2Fmilinus_placeholder.png?alt=media&token=5568a432-acbd-46da-a80e-5b41a3c3b121',
  slogan: 'Le meilleur du fitness dans votre poche ! Prêt à decoller ?',
  description: '',
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
