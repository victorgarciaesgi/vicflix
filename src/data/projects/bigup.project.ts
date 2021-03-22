import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';
import { bigupVideos } from '../videos';

export const bigupProject: Project = {
  id: 'PN9kzl',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fbigup%2Fbigup.png?alt=media&token=33b1737f-3535-48e3-a947-2d74e1719c71',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fbigup%2Fbigup_placeholder.png?alt=media&token=fafbb4e5-5ce3-47e3-ac22-182abd533758',
  logo: 'bigup.png',
  slogan: 'Demande des dédicaces vidéos à tes célébrités préférées',
  description: '',
  title: 'Big Up',
  videos: Object.values(bigupVideos).flat(),
  year: 2018,
  links: [
    {
      title: 'Site client Big Up',
      link: 'https://www.bigupvideo.com/',
    },
  ],
  type: [ProjectType.App, ProjectType.Site, ProjectType.Mobile],
  info: `Aucun lien ou accès d'application administrateur ne sera fourni.
    Toutes les vidéos sont issues de fausses données de test et ne correspondent pas à des vraies données client.
  `,
  technos: [TechnosList.Vue, TechnosList.Typescript, TechnosList.GraphQL, TechnosList.Stripe],
  context: ProjectContext.Totem,
};
