import { TechnosList } from '@constants';
import { AppTrads, Project, ProjectContext, ProjectType } from '@models';

export const vicflixProject: Project = {
  title: 'Vicflix',
  id: 'NEPjn83n',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fvicflix%2Fvicflix.png?alt=media&token=6b697574-f78e-4c0c-ab80-bb674de6e0a8',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fvicflix%2Fvicflix.png?alt=media&token=6b697574-f78e-4c0c-ab80-bb674de6e0a8',
  logo: 'github.png',
  description: `Projet de portefolio personnel permettant de parcourir mes projets, mes expériences et mes compétences dnas une interface familère.`,
  duration: 4,
  videos: [],
  year: 2021,
  type: [ProjectType.App, ProjectType.Site],
  technos: [
    TechnosList.Nuxt,
    TechnosList.Vue,
    TechnosList.Typescript,
    TechnosList.Animejs,
    TechnosList.Tailwind,
  ],
  context: ProjectContext.Personal,
};
