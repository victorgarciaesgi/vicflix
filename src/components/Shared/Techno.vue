<template>
  <Popin theme="g20" v-if="technoContent" class="Techno" mode="hover" :debounce="false">
    <template #content>
      <span class="px-3 py-2 text-sm">{{ technoContent.title }}</span>
    </template>
    <template #button>
      <SvgIcon :src="technoContent.logo" :size="getSize" />
    </template>
  </Popin>
</template>

<script lang="ts">
import { TechnosConstant, TechnosList } from '@constants';
import { Component, Vue, Prop } from 'nuxt-property-decorator';
@Component({})
export default class TechnoItem extends Vue {
  @Prop({ required: true }) techno!: TechnosList;
  @Prop({ default: 'lg' }) size!: 'sm' | 'md' | 'lg';

  get getSize() {
    if (this.size === 'lg') {
      return 50;
    } else if (this.size === 'md') {
      return 36;
    } else {
      return 26;
    }
  }

  get technoContent() {
    return TechnosConstant.find((f) => f.title === this.techno);
  }
}
</script>

<style lang="postcss" scoped>
.Techno {
  &:first-child {
    margin-left: -5%;
  }
}
</style>
