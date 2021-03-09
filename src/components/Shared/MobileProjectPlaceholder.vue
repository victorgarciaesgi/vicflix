<template>
  <NuxtLink
    :to="toPreviewLink"
    class="MobileProjectPlaceholder / flex-0 flex w-32 h-48 mr-2 overflow-hidden rounded cursor-pointer"
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
  @Prop() project!: Project;
  @Prop({ default: false, type: Boolean }) showProgress!: boolean;

  public init = false;
  public rendered = false;
  public showPreview = false;

  public progress = 0;

  get picture() {
    const match = /^(.+)(\.\w+)$/.exec(this.project.picture);
    if (match) {
      return `/projects/${match[1]}_placeholder${match[2]}`;
    }
    return null;
  }

  get toPreviewLink(): Location {
    return {
      path: this.$route.path,
      query: {
        jbv: this.project.id,
      },
    };
  }

  get logo() {
    return `/logos/${this.project.logo}`;
  }

  async created() {
    const video = await VideoProgressModule.actions.getProjectProgress(this.project.id);
    if (video) {
      this.progress = video.percentage;
    }
  }
}
</script>

<style lang="postcss" scoped>
.Preview {
  box-shadow: 0 0 10px rgba(0, 0, 0, 1);
}
</style>
