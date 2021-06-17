<template>
  <div
    class="sm:px-2 sm:flex sm:justify-center sm:flex-col relative block w-full px-10 pt-40 pb-20"
  >
    <h2 class="sm:text-center mb-5 font-semibold"> {{ $t($messages.Skills.Title) }} </h2>
    <div class="ProjectGrid / sm:gap-1 sm:self-center grid justify-start">
      <component
        :is="isMobile ? 'MobileSkillPlaceholder' : 'SkillPlaceholder'"
        v-for="skill of skills"
        :key="skill.id"
        :data="skill"
        class="!mr-0"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { SkillPlaceholder, MobileSkillPlaceholder } from '@components';
import { TechnosConstant } from '@constants';
import { BreakpointMixin } from '@mixins';
import { Component, Watch } from 'nuxt-property-decorator';

@Component({
  components: {
    SkillPlaceholder,
    MobileSkillPlaceholder,
  },
})
export default class Skills extends BreakpointMixin {
  head() {
    return {
      title: this.$t(this.$messages.Nav.Skills),
    };
  }

  public skills = TechnosConstant;
}
</script>

<style lang="postcss" scoped>
div.ProjectGrid {
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-flow: row dense;

  /* @screen md {
    grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  } */
  @screen sm {
    gap: 6px;
    grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  }
}
</style>
