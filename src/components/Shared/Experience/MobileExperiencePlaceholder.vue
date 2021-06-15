<template>
  <NuxtLink
    :to="toPreviewLink"
    class=" MobileExperiencePlaceholder / flex-0 flex w-32 h-48 mr-2 overflow-hidden rounded cursor-pointer"
  >
    <VImg :src="picture" class="rounded" />
    <SvgIcon
      :src="data.type === ExperienceType.Job ? 'social/job' : 'social/school'"
      style="filter: drop-shadow(3px 2px 2px rgba(0, 0, 0, 0.6))"
      class="left-1/2 bottom-3 absolute w-8 h-8 transform -translate-x-1/2"
    />
  </NuxtLink>
</template>

<script lang="ts">
import { Experience, ExperienceType } from '@models';
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { Location } from 'vue-router';

@Component({})
export default class MobileExperiencePlaceholder extends Vue {
  @Prop() data!: Experience;

  public progress = 0;
  public ExperienceType = ExperienceType;

  get picture() {
    return this.data.logo;
  }

  get toPreviewLink(): Location {
    return {
      path: this.$route.path,
      query: {
        xp: this.data.id,
        ...this.$route.query,
      },
    };
  }
}
</script>

<style lang="postcss" scoped>
.MobileExperiencePlaceholder {
  scroll-snap-align: start;
}
</style>
