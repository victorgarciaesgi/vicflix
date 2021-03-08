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
      if (existingProject) {
        existingProject.timestamp = timestamp;
      } else {
        progressList.push({ timestamp, videoId, duration, episode });
      }
    },
  },
  actions: {
    getVideoProgress({ state: { progressList } }, videoId: string): number | undefined {
      return progressList.find((f) => f.videoId === videoId)?.timestamp;
    },
    getProjectProgress({ state: { progressList } }, projectId: string): number | undefined {
      const project = allProjects.find((f) => f.id === projectId);
      if (project) {
        const videos = progressList.filter(({ videoId }) =>
          project.videos.find((f) => f.id === videoId)
        );
        const pendingVideo = videos.find(({ duration, timestamp }) => {
          const percentage = (duration / timestamp) * 100;
          return percentage < 95;
        });
        if (pendingVideo) {
          return (pendingVideo.duration / pendingVideo.timestamp) * 100;
        }
      }
    },
  },
});
