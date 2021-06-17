<template>
  <div
    class="sm:px-2 sm:flex sm:justify-center sm:flex-col relative block w-full px-10 pt-40 pb-20"
  >
    <h2 class="sm:text-center mb-5 font-semibold">{{ $t($messages.Nav.Experience) }}s</h2>
    <div class="ProjectGrid / sm:gap-1 sm:self-center grid justify-start">
      <component
        :is="isMobile ? 'MobileExperiencePlaceholder' : 'ExperiencePlaceholder'"
        v-for="experience of experiences"
        :key="experience.id"
        :data="experience"
        :in-carrousel="false"
        class="!mr-0"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { allExperiences } from '@data';
import { BreakpointMixin } from '@mixins';
import { Component } from 'nuxt-property-decorator';
import { ExperiencePlaceholder, MobileExperiencePlaceholder } from '@components';

@Component({
  components: {
    ExperiencePlaceholder,
    MobileExperiencePlaceholder,
  },
})
export default class Experience extends BreakpointMixin {
  head() {
    return {
      title: this.$t(this.$messages.Nav.Experience),
    };
  }

  public experiences = allExperiences;
}
</script>

<style lang="postcss" scoped>
div.ProjectGrid {
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 230px));
  grid-auto-flow: row dense;

  /* @screen md {
    grid-template-columns: repeat(auto-fit, minmax(9rem, 230px));
  } */
  @screen sm {
    gap: 6px;
    grid-template-columns: repeat(auto-fit, minmax(8rem, 8rem));
  }
}
</style>
