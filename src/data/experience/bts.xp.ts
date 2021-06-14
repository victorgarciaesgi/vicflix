import { ExperienceType } from '@models';
import { differenceInMonths } from 'date-fns';
import { Experience } from 'models/xp.model';

export const btsXp: Experience = {
  id: 'PBHHSjhn',
  logo: 'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FExperiences%2Fbtssio.png?alt=media&token=712692ab-e2a9-4693-ab34-37b9a0fce68e',
  description: `BTS Services informatiques aux organisations option B solutions logicielles et applications métiers`,
  title: 'BTS SIO Slam',
  year: 2014,
  technos: [],
  type: ExperienceType.Studies,
  duration: 12,
  role: 'Étudiant développeur',
  links: [
    {
      link: 'https://www.onisep.fr/Ressources/Univers-Formation/Formations/Post-bac/bts-services-informatiques-aux-organisations-option-b-solutions-logicielles-et-applications-metiers',
      title: `Site BTS SIO`,
    },
  ],
  location: 'Chennevières, France',
};
