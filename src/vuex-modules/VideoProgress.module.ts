import { allProjects } from '@data';
import { ProgressList } from '@models';
import { VuexModule } from 'vuex-typed-modules';

interface VideoProgress {
  progressList: ProgressList[];
}

const _state: VideoProgress = {
  progressList: [],
};

export const VideoProgressModule = new VuexModule({
  name: 'VideoProgressModule',
  state: _state,
  mutations: {
    updateVideoProgress(
      { progressList },
      {
        timestamp,
        videoId,
        duration,
        episode,
      }: { videoId: string; timestamp: number; duration: number; episode: number }
    ) {
      const existingProject = progressList.find((f) => f.videoId === videoId);
      const percentage = (timestamp / duration) * 100;
      if (existingProject) {
        existingProject.timestamp = timestamp;
        existingProject.percentage = percentage;
      } else {
        progressList.push({ timestamp, videoId, duration, episode, percentage });
      }
    },
  },
  actions: {
    async getVideoProgress(
      { state: { progressList } },
      videoId: string
    ): Promise<ProgressList | undefined> {
      const videoProgress = progressList.find((f) => f.videoId === videoId);
      return videoProgress;
    },
    async getProjectProgress(
      { state: { progressList } },
      projectId: string
    ): Promise<ProgressList | undefined> {
      const project = allProjects.find((f) => f.id === projectId);
      if (project) {
        const videos = progressList
          .filter(({ videoId }) => project.videos.find((f) => f.id === videoId))
          .sort((a, b) => a.episode - b.episode);
        const pendingVideo = videos.find(({ percentage }) => {
          return percentage < 95;
        });
        return pendingVideo;
      }
    },
  },
});
