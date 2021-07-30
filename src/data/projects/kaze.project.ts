import { TechnosList } from '@constants';
import { AppTrads, Project, ProjectContext, ProjectType } from '@models';
import { kazeVideos } from '../videos/kaze.videos';

export const kazeProject: Project = {
  title: 'Kazé France',
  id: 'CNXqpj',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fkaze%2Fcover.png?alt=media&token=aa1c8070-4682-46fb-aaa6-dc23ad9e4bad',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fkaze%2Fchainsaw.jpg?alt=media&token=f1a01c8b-2112-4c20-9b45-345839664573',
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
  videos: Object.values(kazeVideos).flat(),
  year: 2020,
  links: [
    {
      title: 'Site de Kazé',
      link: 'https://client.kaze-staging.devtotem.team/',
    },
  ],
  type: [ProjectType.App, ProjectType.Site],
  info: AppTrads.Projects.InfoWarning,
  technos: [
    TechnosList.Nuxt,
    TechnosList.Vue,
    TechnosList.Typescript,
    TechnosList.GraphQL,
    TechnosList.Gitlab,
  ],
  context: ProjectContext.Totem,
};
