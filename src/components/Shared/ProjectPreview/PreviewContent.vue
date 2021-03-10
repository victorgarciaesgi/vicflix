<template>
  <div class="flex-nowrap bg-g10 flex flex-col overflow-y-auto">
    <div class="Picture-Wrapper / h-96 flex-0 flex">
      <VImg class="Cover" :src="picture" type="default" />
      <div class="bottom-8 sm:bottom-8 left-8 absolute flex flex-col items-start">
        <img
          :src="logo"
          class="sm:h-24 h-32"
          style="filter: drop-shadow(3px 2px 3px rgba(0, 0, 0, 0.4))"
        />
        <div
          class="sm:hidden flex flex-row items-center mt-4"
          style="filter: drop-shadow(3px 2px 3px rgba(0, 0, 0, 0.4))"
        >
          <img src="/icon.png" width="16" />
          <span class="text-w240 ml-2 text-sm font-semibold tracking-widest">PROJECT</span>
        </div>
        <div class="sm:hidden flex flex-row items-center mt-4">
          <Action icon="actions/play" theme="white" @click="playFirstVideo">Lecture</Action>
          <Popin mode="hover" theme="white">
            <template #content>
              <span class="px-3 py-1 text-black">
                {{ isInWishList ? 'Supprimer de ma liste' : 'Ajouter à ma liste' }}
              </span>
            </template>
            <template #button>
              <div
                @click="addToWishList"
                class="center bg-bg4 border-bg10 flex p-1 ml-2 border-2 rounded-full"
              >
                <SvgIcon :src="`${isInWishList ? 'forms/done' : 'actions/add'}`" :size="26" />
              </div>
            </template>
          </Popin>
        </div>
      </div>
    </div>
    <div class="Infos-Wrapper / flex-0 flex flex-col px-8 py-5">
      <div class="-sm:hidden flex flex-col mb-8">
        <Action
          icon="actions/play"
          class="!mb-2"
          :w-full="true"
          theme="white"
          size="md"
          @click="playFirstVideo"
          >Lecture</Action
        >
        <Action
          @click="addToWishList"
          :icon="`${isInWishList ? 'forms/done' : 'actions/add'}`"
          :w-full="true"
          size="md"
        >
          {{ isInWishList ? 'Supprimer de ma liste' : 'Ajouter à ma liste' }}
        </Action>
      </div>
      <div class="sm:flex-col flex flex-row items-start">
        <div class="flex flex-col flex-1">
          <div class="flex flex-row items-center">
            <span class="text-green font-bold">Recommandé à 97%</span>
            <span class="ml-2">{{ project.year }}</span>
            <span class="border-bg9 px-1 py-px ml-2 text-sm border">16+</span>
          </div>
          <p class="mt-5">{{ project.slogan }}</p>
          <p class="mt-2">{{ project.description }}</p>
          <div v-if="project.links" class="flex flex-row mt-4">
            <a
              v-for="link of project.links"
              :key="link.link"
              :href="link.link"
              target="_blank"
              class="text-bg6 flex flex-row items-center px-3 py-1 mb-2 mr-2 text-sm bg-white rounded-full"
            >
              <span>{{ link.title }}</span>
              <SvgIcon src="actions/open_in" class="ml-1" :size="16" />
            </a>
          </div>
          <p v-if="project.info" class="text-w140 py-5 text-sm">{{ project.info }}</p>
        </div>
        <div class="flex-0 sm:flex-row sm:w-full sm:py-4 flex flex-col w-1/3 ml-2 text-sm">
          <div class="sm:mr-2 relative mb-4 mr-2">
            <span class="text-bg8">Distribution: </span>
            <span>Victor Garcia</span>
          </div>
          <div class="relative mb-4 mr-2">
            <span class="text-bg8">Genre: </span>
            <span>{{ project.type.join(', ') }}</span>
          </div>
          <div class="relative mb-4 mr-2">
            <span class="text-bg8">Contexte: </span>
            <span>{{ project.context }}</span>
          </div>
          <div class="sm:flex-row sm:items-center relative flex flex-col mb-4">
            <span class="text-bg8">Technologies: </span>
            <div class="flex flex-row items-center">
              <Techno v-for="techno of project.technos" :key="techno" :techno="techno" size="md" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="project.videos.length" class="flex flex-col">
        <div class="flex flex-col justify-between">
          <h2 class="border-g80 py-2 mb-2 border-b">Épisodes</h2>
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

<script lang="ts">
import { Project, routerPagesNames } from '@models';
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import VideoPreviewBanner from '../VideoPreviewBanner.vue';
import Techno from '../Techno.vue';
import { VideoProgressModule } from '@store';

@Component({
  components: {
    Techno,
    VideoPreviewBanner,
  },
})
export default class PreviewContent extends Vue {
  @Prop({ required: true }) project!: Project;

  get picture() {
    if (this.project) {
      const match = /^(.+)(\.\w+)$/.exec(this.project.picture);
      if (match) {
        return `/projects/${match[1]}${match[2]}`;
      }
      return null;
    }
    return null;
  }

  get logo() {
    return `/logos/${this.project?.logo}`;
  }

  get isInWishList() {
    return !!VideoProgressModule.state.wishList.find((f) => f.id === this.project.id);
  }

  addToWishList() {
    if (this.isInWishList) {
      VideoProgressModule.mutations.removeProjectFromWishList(this.project);
    } else {
      VideoProgressModule.mutations.addProjectToWishList(this.project);
    }
  }

  async playFirstVideo() {
    const progress = await VideoProgressModule.actions.getProjectProgress(this.project.id);
    if (progress) {
      this.$router.push({ name: routerPagesNames.watch.id, params: { id: progress.video.id } });
    } else {
      this.$router.push({
        name: routerPagesNames.watch.id,
        params: { id: this.project.videos[0].id },
      });
    }
  }
}
</script>

<style lang="postcss" scoped>
div.Picture-Wrapper {
  .Cover >>> img {
    mask-image: linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(10, 10, 10, 1) 40%);
  }
}
</style>
