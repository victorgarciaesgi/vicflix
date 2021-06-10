import { TechnosList } from '@constants';
import { AppTrads, Project, ProjectContext, ProjectType } from '@models';

export const kazeProject: Project = {
  title: 'Kazé France',
  id: 'CNXqpj',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fkaze%2Fchez_kaze_guide_book_artbook_et_roman_pour_blue_exorcist_2378%201.png?alt=media&token=ff6d181d-717d-4b37-b6a5-ec50c929e2a7',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fkaze%2F5633-Header_KazeHikaru_2000x800%201.png?alt=media&token=080f907f-bd81-44cb-a800-5b86a79204a0',
  logo: 'kaze.png',
  slogan: AppTrads.ProjectDescriptions.Kaze.Slogan,
  description: `Kazé est la refonte du site client et de l'application admin d'éditeur de Manga et Anime Kazé France.
  Il consistait à refaire de 0 leur vitrine actuelle tout en incluant leurs données déjà existantes.
  
  Ce projet permet entre autres à:
  - Créer et éditer une licence Anime/Manga (admin)
  - Créer et éditer un produit Anime/Manga (admin)
  - Visualiser les prochaines sorties (client)
  - Rechercher parmis le catalogue Anime/Manga (client)
  - Visualiser toutes les description et liens d'achats des produits
  
  Rôle: Développeur front

  Équipe: 1 developpeur back, 1 developpeur front`,
  duration: 2,
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
  technos: [
    TechnosList.Nuxt,
    TechnosList.Vue,
    TechnosList.Typescript,
    TechnosList.GraphQL,
    TechnosList.Gitlab,
  ],
  context: ProjectContext.Totem,
};
