import { allProjects } from '@data';
import { ProgressList, Project, ProjectVideo } from '@models';
import { VuexModule } from 'vuex-typed-modules';

interface VideoProgress {
  progressList: ProgressList[];
  wishList: Project[];
  firstVisit: boolean;
}

const _state: VideoProgress = {
  progressList: [],
  wishList: [],
  firstVisit: false,
};

export const VideoProgressModule = new VuexModule({
  name: 'VideoProgressModule',
  logger: false,
  state: _state,
  mutations: {
    updateVideoProgress(
      { progressList },
      { video, timestamp, duration }: { video: ProjectVideo; timestamp: number; duration: number }
    ) {
      const existingProject = progressList.find((f) => f.video.id === video.id);
      const percentage = (timestamp / duration) * 100;
      if (existingProject) {
        existingProject.timestamp = timestamp;
        existingProject.percentage = percentage;
      } else {
        progressList.push({ timestamp, video, percentage, duration });
      }
    },
    addProjectToWishList({ wishList }, project: Project | null) {
      if (project && !wishList.find((f) => f.id === project?.id)) {
        wishList.push(project);
      }
    },
    removeProjectFromWishList({ wishList }, project: Project | null) {
      const index = wishList.findIndex((f) => f.id === project?.id);
      wishList.splice(index, 1);
    },
  },
  actions: {
    async getVideoProgress(
      { state: { progressList } },
      videoId: string
    ): Promise<ProgressList | undefined> {
      const videoProgress = progressList.find((f) => f.video.id === videoId);
      return videoProgress;
    },
    async getProjectProgress(
      { state: { progressList } },
      projectId: string
    ): Promise<ProgressList | undefined> {
      const project = allProjects.find((f) => f.id === projectId);
      if (project) {
        const videos = progressList
          .filter(({ video }) => project.videos.find((f) => f.id === video.id))
          .sort((a, b) => {
            if (a.video.season === b.video.season) {
              return b.video.episode - a.video.episode;
            }
            return b.video.season - a.video.season;
          });
        const pendingVideo = videos.find(({ percentage, duration, timestamp }) => {
          return timestamp < duration - 5;
        });
        if (pendingVideo) {
          return pendingVideo;
        } else {
          const lastVideo = videos[0];
          if (lastVideo) {
            let sameSeasonNextVideo = project?.videos.find(
              (f) =>
                f.episode === lastVideo.video.episode + 1 && f.season === lastVideo.video.season
            );
            if (!sameSeasonNextVideo) {
              sameSeasonNextVideo = project?.videos.find(
                (video) => video.episode === 1 && video.season === lastVideo.video.season + 1
              );
            }
            if (sameSeasonNextVideo) {
              VideoProgressModule.mutations.updateVideoProgress({
                video: sameSeasonNextVideo,
                duration: sameSeasonNextVideo.duration,
                timestamp: 0,
              });
              return progressList.find((f) => f.video.id === sameSeasonNextVideo?.id);
            }
          }
        }
      }
    },
  },
});
