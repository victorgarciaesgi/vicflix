import { ProjectVideo } from '@models';

const projectId = 'LAtFkd';

export const profeelVideos: ProjectVideo[] = [
  {
    id: 'INiu876',
    title: "Présentation de l'application",
    description: "Petit tour du propriétaire de l'application Profeel Admin",
    duration: 73,
    episode: 1,
    projectId,
    videoUrl:
      'https://firebasestorage.googleapis.com/v0/b/vicflix-videos.appspot.com/o/Profeel_video.mp4?alt=media&token=780d7a57-0ee1-4e50-8a76-ccf616b79f18',
    preview:
      'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Video%20previews%2Fprofeel-placeholder.png?alt=media&token=ea0a84c8-c69d-4d64-9ec1-11b961a6ed84',
  },
  {
    id: 'NLz6HLH',
    title: 'Test second episode',
    description: 'Lorem ipsum blab bla bla',
    duration: 73,
    episode: 2,
    projectId,
    videoUrl:
      'https://firebasestorage.googleapis.com/v0/b/vicflix-videos.appspot.com/o/Profeel_video.mp4?alt=media&token=780d7a57-0ee1-4e50-8a76-ccf616b79f18',
    preview:
      'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Video%20previews%2Fprofeel-placeholder.png?alt=media&token=ea0a84c8-c69d-4d64-9ec1-11b961a6ed84',
  },
];
