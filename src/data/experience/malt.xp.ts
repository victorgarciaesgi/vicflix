import { TechnosList } from '@constants';
import { ExperienceType } from '@models';
import { differenceInMonths } from 'date-fns';
import { Experience } from 'models/xp.model';

export const maltXp: Experience = {
  id: 'aldhalhd',
  logo: 'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FExperiences%2Fmalt%20logo.jpeg?alt=media&token=236c145d-86e3-4850-9dcd-d1768ebc98d4',
  description: ``,
  title: 'Malt',
  technos: [TechnosList.Vue, TechnosList.Typescript, TechnosList.Jest],
  year: 2021,
  type: ExperienceType.Job,
  duration: differenceInMonths(new Date(), new Date(2021, 11, 15)) + 1,
  currentPosition: true,
  role: 'Front-end engineer',
  links: [{ link: 'https://malt.com', title: 'Site de Malt' }],
  location: 'Paris, France',
};
