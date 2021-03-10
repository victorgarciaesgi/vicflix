import { allProjects } from '@data';
import { ProgressList, Project, ProjectVideo } from '@models';
import { VuexModule } from 'vuex-typed-modules';

interface VideoProgress {
  progressList: ProgressList[];
  wishList: Project[];
}

const _state: VideoProgress = {
  progressList: [],
  wishList: [],
};

export const VideoProgressModule = new VuexModule({
  name: 'VideoProgressModule',
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
    addProjectToWishList({ wishList }, project) {
      if (!wishList.find((f) => f.id === project.id)) {
        wishList.push(project);
      }
    },
    removeProjectFromWishList({ wishList }, project) {
      const index = wishList.findIndex((f) => f.id === project.id);
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
          .sort((a, b) => a.video.episode - b.video.episode);
        const pendingVideo = videos.find(({ percentage }) => {
          return percentage < 95;
        });
        return pendingVideo;
      }
    },
  },
});
