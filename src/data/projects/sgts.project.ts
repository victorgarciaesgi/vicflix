import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';

export const sgtsProject: Project = {
  title: 'simple-graphql-to-typescript',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fsgts%2Fsgts.png?alt=media&token=a3f4251b-8772-4ffb-9864-71e5859a66f3',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fsgts%2Fsgts_placeholder.png?alt=media&token=bc2459c1-a215-4abc-af51-86e2ab54812b',
  slogan: '🚀 🔄 Simple Typescript interface generator from a GraphQL api schemas or URL',
  description:
    'All your Queries and Mutations transformed into functions with a pre-generated GraphQL template',
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
  technos: [TechnosList.Typescript, TechnosList.GraphQL, TechnosList.Jest, TechnosList.VuePress],
  context: ProjectContext.Personal,
};
