import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';

export const vuexTypedModulesProject: Project = {
  title: 'vuex-typed-modules',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fvuex-typed-module%2Fvuex.png?alt=media&token=0687dbbd-8678-4f06-bbcc-e3345ccaf614',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fvuex-typed-module%2Fvuex.png?alt=media&token=0687dbbd-8678-4f06-bbcc-e3345ccaf614',
  slogan: '🧰 A VueX wrapper to fully type your modules without boilerplate',
  description: `Mon envie de vouloir un typage fort sur mes projets a commencé avec ce projet personnel.

    La librairie de state-management de Vue (Vuex), ne permettait pas de pouvoir typer ses actions et mutations simplement et rapidement. 
    Cela nécessitait beaucoup plus de code que nécessaire et n'était pas fail-proof.
    Après plusieurs essais échoués et l'inspiration d'une autre librairie voulant résoudre ce problème (vuex-typex), j'avais enfin réussi à pousser l'intégration de typescirpt au sein de Vuex encore plus loin.
    La sortie de Typescript 2.8 et ses nouveautés concernant les types conditionnels et du type inference sur les types génériques m'a permit de pouvoir faire ce plugin Vuex.
   
    Au début utilisé en local, j'ai décidé de l'ouvrir à l'open source après l'avoir testé sur des projets en production au préalable.
  `,
  logo: 'github.png',
  videos: [],
  year: 2019,
  links: [
    {
      title: 'Github homepage',
      link: 'https://github.com/victorgarciaesgi/vuex-typed-modules',
    },
  ],
  badges: [
    {
      img: 'https://img.shields.io/npm/v/vuex-typed-modules.svg',
      link: 'https://www.npmjs.com/package/vuex-typed-modules',
    },
    {
      img: 'https://img.shields.io/npm/dm/vuex-typed-modules.svg',
      link: 'https://www.npmjs.com/package/vuex-typed-modules',
    },
    {
      img: 'https://img.shields.io/npm/dt/vuex-typed-modules.svg',
      link: 'https://www.npmjs.com/package/vuex-typed-modules',
    },
    {
      img: 'https://img.shields.io/npm/l/vuex-typed-modules.svg',
    },
  ],
  type: [ProjectType.Library],
  id: 'PZznSclk',
  technos: [TechnosList.Typescript, TechnosList.Nuxt],
  context: ProjectContext.Personal,
};
