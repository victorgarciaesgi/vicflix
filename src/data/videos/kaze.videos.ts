import { ProjectVideo } from '@models';

const projectId = 'CNXqpj';

export const kazeVideos: ProjectVideo[] = [
  {
    id: 'LEJNLNKKbb',
    title: "Présentation de l'admin",
    description: "Victor nous fait découvrir l'application Kazé Admin",
    duration: 81,
    episode: 1,
    season: 1,
    projectId,
    thumbnail:
      'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Video%20previews%2FKaze%2FPresentation.png?alt=media&token=26d9e79f-2dd0-4ccb-87fc-e2555b9df17c',
    videoUrl:
      'https://firebasestorage.googleapis.com/v0/b/vicflix-videos.appspot.com/o/Kaze%2FPresentation%20Admin.mp4?alt=media&token=2855aff2-5737-40b8-a214-1e60c72715c1',
  },
  {
    id: 'ZnkbEBKBkkn',
    title: 'Créer une licence',
    description: `Démonstration de la création d'une licence sur Kazé Admin`,
    duration: 168,
    episode: 2,
    season: 1,
    projectId,
    thumbnail:
      'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Video%20previews%2FKaze%2FCreer%20licence.png?alt=media&token=6440e9e4-9cf9-44f9-9521-f329738fedbd',
    videoUrl:
      'https://firebasestorage.googleapis.com/v0/b/vicflix-videos.appspot.com/o/Kaze%2FCre%CC%81er%20une%20licence.mp4?alt=media&token=af560f80-e1b6-449e-9b86-70ce04393484',
  },
];
