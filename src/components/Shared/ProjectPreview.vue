<template>
  <Modal :width="800" :show="show" @close="goBack">
    <template #content>
      <div v-if="project" class="flex-nowrap flex flex-col overflow-y-auto">
        <div class="Picture-Wrapper / h-96 flex-0 flex">
          <VImg :src="picture" type="default" />
          <div class="bottom-16 left-8 absolute flex flex-col items-start">
            <img
              :src="logo"
              class="h-32"
              style="filter: drop-shadow(3px 2px 3px rgba(0, 0, 0, 0.2))"
            />
            <div class="flex flex-row items-center mt-4">
              <Action icon="actions/play" theme="white">Lecture</Action>
              <Popin mode="hover" theme="white">
                <template #content>
                  <span class="px-3 py-1 text-black">Ajouter à ma liste</span>
                </template>
                <template #button>
                  <div class="center bg-bg4 border-bg10 flex p-1 ml-2 border-2 rounded-full">
                    <SvgIcon src="actions/add" :size="26" />
                  </div>
                </template>
              </Popin>
            </div>
          </div>
        </div>
        <div class="Infos-Wrapper / flex-0 flex flex-col px-8 py-5">
          <div class="flex flex-row items-start">
            <div class="flex flex-col flex-1">
              <div class="flex flex-row items-center">
                <span class="text-green font-bold">Recommandé à 97%</span>
                <span class="ml-2">{{ project.year }}</span>
                <span class="border-bg9 px-1 py-px ml-2 text-sm border">16+</span>
              </div>
              <p class="mt-5">{{ project.description }}</p>
              <div v-if="project.links" class="flex flex-row mt-4">
                <a
                  v-for="link of project.links"
                  :key="link.link"
                  :href="link.link"
                  target="_blank"
                  class="text-text8 text-md mr-2 underline"
                  >{{ link.title }}</a
                >
              </div>
            </div>
            <div class="flex-0 flex flex-col w-1/3 text-sm">
              <div class="relative mb-4">
                <span class="text-bg8">Distribution: </span>
                <span>Victor Garcia</span>
              </div>
              <div class="relative mb-4">
                <span class="text-bg8">Genre: </span>
                <span>{{ project.type }}</span>
              </div>
              <div class="relative flex flex-row items-center mb-4">
                <span class="text-bg8">Technologies: </span>
                <Techno
                  v-for="techno of project.technos"
                  :key="techno"
                  :techno="techno"
                  size="md"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="flex flex-row justify-between">
              <h2 class="mb-4">Épisodes</h2>
              <div class="flex flex-col">
                <VideoPreviewBanner
                  v-for="(video, index) of project.videos"
                  :key="index"
                  :video="video"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { allProjects } from '@constants';
import { Project } from '@models';
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator';
import Techno from './Techno.vue';
import VideoPreviewBanner from './VideoPreviewBanner.vue';

@Component({
  components: {
    Techno,
    VideoPreviewBanner,
  },
})
export default class ProjectPreview extends Vue {
  @Prop() id!: string;
  @Prop() show!: boolean;

  public project: Project | null = null;

  get picture() {
    if (this.project) {
      const match = /^(.+)(\.\w+)$/.exec(this.project.picture);
      if (match) {
        return `/projects/${match[1]}_placeholder${match[2]}`;
      }
      return null;
    }
    return null;
  }

  @Watch('id', { immediate: true }) idChanged() {
    const project = allProjects.find((f) => f.id === this.id);
    if (project) {
      this.project = project;
    } else {
      this.$router.push(this.$route.path);
    }
  }

  get logo() {
    return `/logos/${this.project?.logo}`;
  }

  goBack() {
    this.$router.push(this.$route.path);
  }

  @Watch('show', { immediate: true }) showWatch() {
    if (this.show) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
  }
}
</script>

<style lang="postcss" scoped>
div.Picture-Wrapper {
  .VImg {
    mask-image: linear-gradient(to top, rgba(0, 0, 0, 0) 5%, black 60%);
  }
}
</style>
