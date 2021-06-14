import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';

export const sgtsProject: Project = {
  title: 'simple-graphql-to-typescript',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fsgts%2Fsgts_placeholder.png?alt=media&token=bc2459c1-a215-4abc-af51-86e2ab54812b',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fsgts%2Fsgts_placeholder.png?alt=media&token=bc2459c1-a215-4abc-af51-86e2ab54812b',
  slogan: '🚀 🔄 Simple Typescript interface generator from a GraphQL api schemas or URL',
  description: `Ce projet m'est venu à l'idée après avoir réalisé 2 projets avec GraphQL et Typescript (Bigup & Peppy).
    Je passais beaucoup de temps à écrire à la main mes interfaces Typescript correspondant au schéma GraphQL de notre API.
    Après mes recherches de solutions, aucune de me convenait (Apollo codegen, Graphql codegen, GraphQl Zeus...).
    Je décidai donc de réaliser ma propre solution pour générer mes interfaces.

    Le projet a commencé par un simple outil CLI qui me générait un fichier d'interfaces simples en lui précisant l'url de l'API GraphQL et un chemin de sortie.
    Il a beaucoup évolué au fur et à mesure de mes projets.
    
    Par exemple au cours de mon projet Crèches Lib', je remarquais que je perdais beaucoup du temps à écrire toutes mes queries et mutations GraphQL, et le refactoring était compliqué durant le temps de dévelopement en raison de renommage, changements de types etc...
    j'ai donc amélioré cette librairie en ajoutant la génération automatique et typée de queries et mutations.
    
    Ce projet m'a beaucoup apporté d'expérience en Node, faire un CLI, typescript et GraphQL.
    Je fais évoluer continuellement les fonctionnalités, souvent grâce au besoin des projets en cours.`,

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
  badges: [
    {
      img: 'https://img.shields.io/npm/v/simple-graphql-to-typescript.svg',
      link: 'https://www.npmjs.com/package/simple-graphql-to-typescript',
    },
    {
      img: 'https://img.shields.io/npm/dm/simple-graphql-to-typescript.svg',
      link: 'https://www.npmjs.com/package/simple-graphql-to-typescript',
    },
    {
      img: 'https://img.shields.io/npm/dt/simple-graphql-to-typescript.svg',
      link: 'https://www.npmjs.com/package/simple-graphql-to-typescript',
    },
    {
      img: 'https://img.shields.io/github/workflow/status/victorgarciaesgi/simple-graphql-to-typescript/Node.js%20CI',
    },
    {
      img: 'https://img.shields.io/npm/l/simple-graphql-to-typescript.svg',
    },
  ],
  type: [ProjectType.Library],
  id: 'MNJ9OK3jn',
  technos: [TechnosList.Typescript, TechnosList.GraphQL, TechnosList.Jest, TechnosList.VuePress],
  context: ProjectContext.Personal,
};
