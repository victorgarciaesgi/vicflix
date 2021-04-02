<template>
  <div class="relative block w-full px-10 pt-40 pb-20">
    <h2 class="mb-5 font-semibold"> Principales technologies utilisées </h2>
    <div class="ProjectGrid / sm:px-2 sm:gap-1 grid justify-start">
      <component
        :is="isMobile ? 'MobileSkillPlaceholder' : 'SkillPlaceholder'"
        v-for="skill of skills"
        :key="skill.id"
        :skill="skill"
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
  head: {
    title: 'Recherche',
  },
})
export default class Skills extends BreakpointMixin {
  public skills = TechnosConstant;
}
</script>

<style lang="postcss" scoped>
div.ProjectGrid {
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-flow: row dense;

  @screen md {
    grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  }
}
</style>
