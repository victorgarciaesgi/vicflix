<template>
  <PlaceholderAnimatedItem
    :baseInfo="data"
    :logo="logo"
    :picture="picture"
    :showProgress="showProgress"
    :videoProgress="videoProgress"
    :previewLink="toPreviewLink"
  >
    <template #card>
      <VImg background="bg3" :src="picture" class="rounded" />
      <img
        :src="logo"
        class="left-3 bottom-3 absolute h-8"
        style="filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.6))"
      />
    </template>
    <template #preview>
      <img
        :src="logo"
        class="left-3 bottom-3 absolute h-8 overflow-hidden"
        style="filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.6))"
      />
    </template>
    <template #picture>
      <img
        ref="pictureRef"
        :src="picture"
        class="object-cover w-full h-full rounded-tl rounded-tr"
      />
    </template>
    <template #previewBlock>
      <div class="Block / flex-nowrap flex flex-col">
        <div class="flex-nowrap flex flex-row">
          <h4 class="flex-1 leading-5">{{ data.title }}</h4>
          <div class="flex-nowrap flex-0 flex flex-row items-center ml-2">
            <Popin mode="hover" :offset="2" theme="text1">
              <template #content>
                <span class="text-bg1 px-3 py-1">{{
                  hasProjectVideos
                    ? videoProgress
                      ? $t($messages.Actions.Continue)
                      : $t($messages.Actions.Play)
                    : $t($messages.Actions.Consult)
                }}</span>
              </template>
              <template #button>
                <div class="center text-bg1 bg-text1 border-text1 flex p-1 border-2 rounded-full">
                  <SvgIcon
                    :src="hasProjectVideos ? 'actions/play' : 'actions/open_in'"
                    :size="20"
                    @click.stop="playFirstVideo"
                  />
                </div>
              </template>
            </Popin>
            <Popin mode="hover" :offset="2" theme="text1">
              <template #content>
                <span class="text-bg1 px-3 py-1">{{ $t($messages.Actions.MoreInfo) }}</span>
              </template>
              <template #button>
                <NuxtLink
                  :to="toPreviewLink"
                  class="center bg-bg2 border-bg10 text-text1 flex p-1 ml-1 border-2 rounded-full"
                >
                  <SvgIcon src="actions/expand" :size="20" />
                </NuxtLink>
              </template>
            </Popin>
          </div>
        </div>
        <div class="c-row-y flex flex-1">
          <div class="text-text9 text-xxs flex flex-row items-center">
            <span>{{ data.type.join(', ') }}</span>
            <span class="px-1">•</span>
            <span>{{ data.year }}</span>
          </div>
          <div class="flex flex-row items-center justify-start -ml-1">
            <Techno v-for="techno of data.technos" :key="techno" :techno="techno" size="sm" />
          </div>
        </div>
      </div>
      <ProjectVideoProgress :progress="videoProgress" />
    </template>
  </PlaceholderAnimatedItem>
</template>

<script lang="ts">
import { ProgressList, Project, routerPagesNames } from '@models';
import { Component, Vue, Prop, Ref } from 'nuxt-property-decorator';
import { Location } from 'vue-router';
import Techno from '../Techno.vue';
import { VideoProgressModule } from '@store';
import ProjectVideoProgress from '../ProjectVideoProgress.vue';
import PlaceholderAnimatedItem from '../PlaceholderAnimatedItem.vue';

@Component({
  components: {
    Techno,
    ProjectVideoProgress,
    PlaceholderAnimatedItem,
  },
})
export default class ProjectPlaceholder extends Vue {
  @Prop() data!: Project;
  @Prop({ default: false, type: Boolean }) showProgress!: boolean;
  @Prop({ default: true }) inCarrousel!: boolean;

  @Ref() root!: HTMLDivElement;
  @Ref() preview?: HTMLDivElement;
  @Ref() pictureRef?: HTMLImageElement;
  @Ref() previewBlock?: HTMLDivElement;

  public videoProgress: ProgressList | null = null;

  get picture() {
    return this.data.placeholder;
  }

  get toPreviewLink(): Location {
    return {
      path: this.$route.path,
      query: {
        ...this.$route.query,
        jbv: this.data.id,
      },
    };
  }

  get hasProjectVideos(): boolean {
    return !!this.data.videos.length;
  }

  get logo() {
    return `/logos/${this.data.logo}`;
  }

  async playFirstVideo() {
    if (this.data.videos.length) {
      const progress = await VideoProgressModule.actions.getProjectProgress(this.data.id);
      if (progress) {
        this.$router.push({ name: routerPagesNames.watch.id, params: { id: progress.video.id } });
      } else {
        this.$router.push({
          name: routerPagesNames.watch.id,
          params: { id: this.data.videos[0].id },
        });
      }
    } else if (this.data.links) {
      Object.assign(document.createElement('a'), {
        target: '_blank',
        href: this.data.links[0].link,
      }).click();
    }
  }

  async created() {
    if (this.showProgress) {
      const video = await VideoProgressModule.actions.getProjectProgress(this.data.id);
      if (video) {
        this.videoProgress = video;
      }
    }
  }
}
</script>
