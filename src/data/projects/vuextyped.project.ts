import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';

export const vuexTypedModulesProject: Project = {
  title: 'vuex-typed-modules',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fvuex-typed-module%2Fvuex.png?alt=media&token=0687dbbd-8678-4f06-bbcc-e3345ccaf614',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fvuex-typed-module%2Fvuex.png?alt=media&token=0687dbbd-8678-4f06-bbcc-e3345ccaf614',
  slogan: '🧰 A VueX wrapper to fully type your modules without boilerplate',
  description: ``,
  logo: 'github.png',
  videos: [],
  year: 2019,
  links: [
    {
      title: 'Github homepage',
      link: 'https://github.com/victorgarciaesgi/vuex-typed-modules',
    },
  ],
  type: [ProjectType.Library],
  id: 'PZznSclk',
  technos: [TechnosList.Typescript, TechnosList.Nuxt],
  context: ProjectContext.Personal,
};
