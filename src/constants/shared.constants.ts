import { IConstant, User } from '@models';

export const isTesting =
  process.env.NUXT_ENV_STAGE === 'testing' ||
  process.env.NUXT_ENV_STAGE === 'staging' ||
  process.env.NODE_ENV === 'development';

export const weekDaysConstant = {
  1: 'Lundi',
  2: 'Mardi',
  3: 'Mercredi',
  4: 'Jeudi',
  5: 'Vendredi',
};

export const usersConstant: User[] = [
  { id: 1, name: 'Victor', picture: '/users/victor.png' },
  { id: 2, name: 'Cooler Victor', picture: '/users/coolvictor.png' },
];

export const cubicTransition = 'cubicBezier(.5, .05, .1, .3)';
