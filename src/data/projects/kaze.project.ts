import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';

export const kazeProject: Project = {
  title: 'Kazé',
  id: 'CNXqpj',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fkaze%2Fchez_kaze_guide_book_artbook_et_roman_pour_blue_exorcist_2378%201.png?alt=media&token=ff6d181d-717d-4b37-b6a5-ec50c929e2a7',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fkaze%2F5633-Header_KazeHikaru_2000x800%201.png?alt=media&token=080f907f-bd81-44cb-a800-5b86a79204a0',
  logo: 'kaze.png',
  slogan: "Éditeur de mangas et d'animes",
  description: '',
  videos: [],
  year: 2020,
  links: [
    {
      title: 'Site de Kazé',
      link: 'https://client.kaze-staging.devtotem.team/',
    },
  ],
  type: [ProjectType.App, ProjectType.Site],
  info: `Aucun lien ou accès d'application administrateur ne sera fourni.
    Toutes les vidéos sont issues de fausses données de test et ne correspondent pas à des vraies données client.
  `,
  technos: [TechnosList.Nuxt, TechnosList.Typescript, TechnosList.GraphQL],
  context: ProjectContext.Totem,
};
