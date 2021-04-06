import { LanguageConfig } from '@models';

export const locale: LanguageConfig = {
  Login: {
    WhoAreYou: 'Qui est-ce ?',
    Logout: 'Se déconnecter',
    Welcome: 'Bienvenue sur Vicflix!',
    WelcomeDesc: `Je suis Victor Garcia, développeur Front-end travaillant principalement avec Vue.js/Nuxt, Typescript et GraphQL.
        
    Vicflix est un de mes projets faisant office de portfolio et il permet de découvrir mes projets réalisés, mes compétences ainsi que ainsi que mes expériences dans une interface familière inspirée d'un grand site de streaming video dont je ne citerai pas le nom.
    
    Bonne visite!`,
  },
  Nav: {
    Home: 'Accueil',
    Projects: 'Projets',
    Experience: 'Expérience',
    Skills: 'Compétences',
  },
  Home: {
    ContinueWithProfile: `Reprendre avec votre profil`,
    MyList: 'Ma Liste',
    Popular: 'Populaires en ce moment',
    All: 'Tous les projets',
  },
  Search: {
    Placeholder: 'Titles, languages, genre...',
  },
  Actions: {
    Play: 'Lecture',
    MoreInfo: "Plus d'infos",
    LetsGo: "C'est parti!",
  },
  Projects: {
    Info: `Aucun lien ou accès d'application administrateur ne sera fourni.
    Toutes les vidéos sont issues de fausses données de test et ne correspondent pas à des vraies données client.`,
  },
  config: {
    code: 'fr',
    iso: 'fr-FR',
    name: 'Français',
  },
};

export default locale;
