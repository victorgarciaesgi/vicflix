import { AppTrads } from './i18n.models';
import { NavLink } from './shared.model';
import { routerPagesNames } from './__routes';

export const navRoutes: NavLink[] = [
  {
    label: AppTrads.Nav.Home,
    link: { name: routerPagesNames.index.index },
    exact: true,
  },
  {
    label: AppTrads.Nav.Projects,
    link: {
      name: routerPagesNames.index.projects,
    },
  },
  {
    label: AppTrads.Nav.Skills,
    link: {
      name: routerPagesNames.index.skills,
    },
  },
  {
    label: AppTrads.Nav.Experience,
    link: {
      name: routerPagesNames.index.experience,
    },
  },
];
