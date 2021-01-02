import { NavLink } from './shared.model';
import { routerPagesNames } from './__routes';

export const navRoutes: NavLink[] = [
  {
    label: 'Accueil',
    link: { name: routerPagesNames.index.index },
    exact: true,
  },
  {
    label: 'Projects',
    link: {
      name: routerPagesNames.index.projects,
    },
  },
  {
    label: 'Experience',
    link: {
      name: routerPagesNames.index.experience,
    },
  },
  {
    label: 'Studies',
    link: {
      name: routerPagesNames.index.studies,
    },
  },
];
