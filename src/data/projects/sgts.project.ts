import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';

export const sgtsProject: Project = {
  picture: 'sgts.png',
  slogan: '🚀 🔄 Simple Typescript interface generator from a GraphQL api schemas or URL',
  description:
    'All your Queries and Mutations transformed into functions with a pre-generated GraphQL template',
  title: 'simple-graphql-to-typescript',
  logo: 'sgts.svg',
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
  type: [ProjectType.Library],
  id: 'MNJ9OK3jn',
  technos: [TechnosList.Typescript, TechnosList.GraphQL],
  context: ProjectContext.Personal,
};
