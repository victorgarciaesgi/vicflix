<template>
  <Popin
    :theme="technoContent.color"
    v-if="technoContent"
    class="Techno"
    mode="hover"
    :debounce="false"
  >
    <template #content>
      <span class="text-w250 text-shadow px-3 py-2">{{ technoContent.title }}</span>
    </template>
    <template #button>
      <SvgIcon @click.stop="toSearchLocation" :src="technoContent.logo" :size="getSize" />
    </template>
  </Popin>
</template>

<script lang="ts">
import { TechnosConstant, TechnosList } from '@constants';
import { BreakpointMixin } from '@mixins';
import { routerPagesNames } from '@models';
import { Component, Vue, Prop } from 'nuxt-property-decorator';
@Component({})
export default class TechnoItem extends BreakpointMixin {
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

  toSearchLocation() {
    if (!this.isMobile) {
      this.$router.push({
        name: routerPagesNames.search,
        query: {
          q: this.techno,
        },
      });
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
