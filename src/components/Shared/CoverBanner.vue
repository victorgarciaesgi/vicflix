<template>
  <div class="CoverBanner / flex flex-col">
    <div class="BannerWrapper / absolute w-full h-full min-h-full">
      <VImg
        class="ImgWrapper"
        style="min-height: 80vh"
        :fill="isMobile ? 'both' : 'both'"
        :src="picture"
      />
    </div>
    <div
      class="
        pt-28
        sm:ml-0 sm:mt-20 sm:w-full
        flex flex-col
        items-start
        sm:max-w-none
        max-w-md
        pb-10
        mt-10
        ml-[53px]
      "
    >
      <div
        class="sm:hidden flex flex-row items-center"
        style="filter: drop-shadow(3px 2px 3px rgba(0, 0, 0, 0.4))"
      >
        <img src="/icon.png" width="18" />
        <span class="text-w240 ml-2 text-sm font-semibold tracking-widest">PROJECT</span>
      </div>
      <div class="sm:w-full sm:items-center flex flex-col items-start py-5">
        <img
          :src="logo"
          class=" sm:max-h-40 sm:h-auto sm:max-w-xs max-h-40 sm:object-center object-contain object-left w-full"
          style="filter: drop-shadow(3px 2px 3px rgba(0, 0, 0, 0.4))"
        />
        <span
          v-if="data.slogan"
          class="sm:text-sm mt-3"
          style="text-shadow: 1px 2px 1px rgba(0, 0, 0, 0.2)"
          >{{ $t(data.slogan) }}</span
        >
        <div class="text-text4 flex flex-row mt-2">
          <TechnoItem v-for="tech of data.technos" :key="tech" :techno="tech" />
        </div>
        <div class="sm:justify-center flex flex-row py-4">
          <Action icon="actions/play" theme="inverted" @click="playFirstVideo">{{
            videoProgress ? $t($messages.Actions.Continue) : $t($messages.Actions.Play)
          }}</Action>
          <Action icon="alerts/info" theme="gray" :to="toPreviewLink">{{
            $t($messages.Actions.MoreInfo)
          }}</Action>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { BreakpointMixin } from '@mixins';
import { ProgressList, Project, routerPagesNames } from '@models';
import { VideoProgressModule } from '@store';
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { Location } from 'vue-router';
import TechnoItem from './Techno.vue';

@Component({
  components: {
    TechnoItem,
  },
})
export default class CoverBanner extends BreakpointMixin {
  @Prop({ required: true }) data!: Project;

  async fetch() {
    const video = await VideoProgressModule.actions.getProjectProgress(this.data.id);
    if (video) {
      this.videoProgress = video;
    }
  }

  public videoProgress: ProgressList | null = null;

  get picture() {
    return this.data.picture;
  }

  get logo() {
    return `/logos/${this.data.logo}`;
  }

  get toPreviewLink(): Location {
    return {
      path: this.$route.path,
      query: {
        jbv: this.data.id,
      },
    };
  }

  async playFirstVideo() {
    const progress = await VideoProgressModule.actions.getProjectProgress(this.data.id);
    if (progress) {
      this.$router.push({ name: routerPagesNames.watch.id, params: { id: progress.video.id } });
    } else {
      this.$router.push({
        name: routerPagesNames.watch.id,
        params: { id: this.data.videos[0].id },
      });
    }
  }
}
</script>

<style lang="postcss" scoped>
div.CoverBanner {
  div.BannerWrapper {
    >>> img {
      mask-image: linear-gradient(to top, rgba(0, 0, 0, 0) 5%, black 60%);
    }
  }
}
</style>
