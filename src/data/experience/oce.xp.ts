import { TechnosList } from '@constants';
import { ExperienceType } from '@models';
import { differenceInMonths } from 'date-fns';
import { Experience } from 'models/xp.model';

export const oceXp: Experience = {
  id: 'OnqllpoI',
  logo: 'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FExperiences%2Foce%20logo.png?alt=media&token=b33d5af0-c384-432b-bf42-0bf86d5658c7',
  description: `Océ Printing Technologies est ma première expérience professionnelle en tant que développeur.
  
  Je suis rentré chez Océ dans le cadre du stage de 2 mois compris dans le cursus de mon BTS SIO.
  Durant ces 2 mois, j'ai pu découvrir des technologies telles qu'angularjs et Typescript.
  
  À la suite de ce stage, j'ai réalisé un contrat d'alternance de 3 ans en parallèle avec mon diplôme de'ingénieur du web à l'ESGI.
  J'ai pu découvrir en plus de nouvelles technologies telle que le C#, le SCSS, Websockets et Webpack, les méthodes de travail en Agile et Scrum.
  `,
  title: 'Océ Printing Technologies',
  technos: [TechnosList.Typescript, TechnosList.Angular],
  year: 2015,
  type: ExperienceType.Job,
  duration: differenceInMonths(new Date(2018, 7, 1), new Date(2015, 7, 1)),
  role: 'Développeur web',
  links: [{ link: 'https://cpp.canon/', title: 'Océ site (now Canon Production Printing)' }],
  location: 'Créteil, France',
};
