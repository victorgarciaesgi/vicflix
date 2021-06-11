import { TechnosList } from '@constants';
import { differenceInMonths } from 'date-fns';
import { Experience } from 'models/xp.model';

export const totemXp: Experience = {
  id: 'jzfjYGK',
  logo: 'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FExperiences%2Ftotem.png?alt=media&token=585b7b87-faf1-4bc0-97cc-1ff642801bf3',
  description: 'Totem',
  title: 'Totem',
  technologies: [
    TechnosList.Nuxt,
    TechnosList.Vue,
    TechnosList.Typescript,
    TechnosList.GraphQL,
    TechnosList.Tailwind,
    TechnosList.Chartjs,
    TechnosList.Gitlab,
  ],
  year: 2018,
  duration: differenceInMonths(new Date(), new Date(2018, 9, 3)),
  role: 'Développeur front / Lead développeur',
};
