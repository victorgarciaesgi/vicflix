import { ExperienceType } from '@models';
import { differenceInMonths } from 'date-fns';
import { Experience } from 'models/xp.model';

export const esgiXp: Experience = {
  id: 'NBnldqJLl',
  logo: 'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FExperiences%2Fesgi%20logo.png?alt=media&token=a5f5e4b9-c4f2-44be-9aa7-6ceb65b2fcff',
  description: `École Supérieure de Génie Informatique`,
  title: 'ESGI',
  year: 2015,
  technos: [],
  type: ExperienceType.Studies,
  duration: differenceInMonths(new Date(2018, 7, 1), new Date(2015, 7, 1)),
  role: 'Étudiant développeur',
  links: [{ link: 'https://www.esgi.fr/', title: `Site de l'ESGI` }],
  location: 'Paris, France',
};
