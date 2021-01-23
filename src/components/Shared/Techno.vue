<template>
  <Popin v-if="technoContent" mode="hover">
    <template #content>
      <span class="px-3 py-2 text-sm">{{ technoContent.title }}</span>
    </template>
    <template #button>
      <SvgIcon :src="technoContent.logo" :size="50" />
    </template>
  </Popin>
</template>

<script lang="ts">
import { TechnosConstant, TechnosList } from '@constants';
import { Component, Vue, Prop } from 'nuxt-property-decorator';
@Component({})
export default class TechnoItem extends Vue {
  @Prop({ required: true }) techno!: TechnosList;

  get technoContent() {
    return TechnosConstant.find((f) => f.title === this.techno);
  }
}
</script>
