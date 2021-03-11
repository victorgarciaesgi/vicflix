<template>
  <div class="c-row-y flex w-full py-3 pl-4">
    <h3 class="font-semibold">
      <slot />
    </h3>
    <div class="List / flex-nowrap flex-0 flex flex-row pr-2 overflow-x-auto">
      <MobileProjectPlaceholder
        v-for="(project, index) of projects"
        :key="index"
        :project="project"
        :showProgress="showProgress"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Project } from '@models';
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import Carrousel from './Display/Carousel.vue';
import MobileProjectPlaceholder from './MobileProjectPlaceholder.vue';
@Component({
  components: {
    Carrousel,
    MobileProjectPlaceholder,
  },
})
export default class MobileProjectList extends Vue {
  @Prop({ required: true }) projects!: Project[];
  @Prop({ default: false, type: Boolean }) showProgress!: boolean;

  public currentIndex = 0;
  public totalSlides = 0;
}
</script>

<style lang="postcss" scoped>
div.List {
  &::-webkit-scrollbar {
    display: none;
  }
  &::after {
    content: '';
    display: block;
    position: relative;
    right: -0.25rem;
    width: 0.25rem;
    height: 1px;
    flex-shrink: 0;
  }
}
</style>
