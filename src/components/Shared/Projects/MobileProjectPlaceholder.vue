<template>
  <NuxtLink
    :to="toPreviewLink"
    class=" MobileProjectPlaceholder / flex-0 flex w-32 h-48 mr-2 overflow-hidden rounded cursor-pointer"
  >
    <VImg :src="picture" class="rounded" />
    <img
      :src="logo"
      style="filter: drop-shadow(3px 2px 2px rgba(0, 0, 0, 0.6))"
      class="left-1/2 bottom-3 absolute h-8 transform -translate-x-1/2"
    />
    <div v-if="showProgress" class="bg-w120 absolute bottom-0 left-0 w-full h-1">
      <div class="bg-red absolute top-0 left-0 h-full" :style="{ width: `${progress}%` }"></div>
    </div>
  </NuxtLink>
</template>

<script lang="ts">
import { Project } from '@models';
import { VideoProgressModule } from '@store';
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { Location } from 'vue-router';

@Component({
  components: {},
})
export default class MobileProjectPlaceholder extends Vue {
  @Prop() data!: Project;
  @Prop({ default: false, type: Boolean }) showProgress!: boolean;

  public progress = 0;

  get picture() {
    return this.data.placeholder;
  }

  get toPreviewLink(): Location {
    return {
      path: this.$route.path,
      query: {
        jbv: this.data.id,
        ...this.$route.query,
      },
    };
  }

  get logo() {
    return `/logos/${this.data.logo}`;
  }

  async created() {
    if (this.showProgress) {
      const video = await VideoProgressModule.actions.getProjectProgress(this.data.id);
      if (video) {
        this.progress = video.percentage;
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.MobileProjectPlaceholder {
  scroll-snap-align: start;
}
</style>
