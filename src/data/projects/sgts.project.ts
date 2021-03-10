import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';

export const sgtsProject: Project = {
  picture: 'crecheslib.png',
  slogan: 'Des places en crèche en toute liberté !',
  description: '',
  title: "Crèches Lib'",
  logo: 'crecheslib.svg',
  videos: [],
  year: 2019,
  links: [
    {
      title: 'Github homepage',
      link: 'https://github.com/victorgarciaesgi/simple-graphql-to-typescript',
    },
    {
      title: 'Documentation',
      link: 'https://sgts.netlify.app/',
    },
  ],
  type: [ProjectType.App, ProjectType.Site],
  id: '9DNjkLd',
  technos: [TechnosList.Typescript, TechnosList.GraphQL],
  context: ProjectContext.Personal,
};
