<template>
  <PlaceholderAnimatedItem
    :baseInfo="data"
    :picture="picture"
    :inCarrousel="inCarrousel"
    :videoProgress="false"
    class="max-w-[250px]"
  >
    <template #card>
      <VImg background="bg3" type="default" :src="picture" class="rounded" />
    </template>
    <template #picture>
      <VImg background="bg3" type="default" :src="picture" class="rounded" />
    </template>
    <template #previewBlock>
      <div class="Block / flex-nowrap flex flex-col">
        <div class="flex-nowrap flex flex-row">
          <h4 class="flex-1 leading-5">{{ data.title }}</h4>

          <div class="flex-nowrap flex-0 flex flex-row items-center ml-2">
            <Popin mode="hover" :offset="2" theme="text1">
              <template #content>
                <span class="text-bg1 px-3 py-1">{{ $t($messages.Actions.MoreInfo) }}</span>
              </template>
              <template #button>
                <NuxtLink
                  :to="toPreviewLink"
                  class="center bg-bg2 border-bg10 text-text1 flex p-1 ml-1 border-2 rounded-full"
                >
                  <SvgIcon src="actions/expand" :size="20" />
                </NuxtLink>
              </template>
            </Popin>
          </div>
        </div>
        <div class="flex flex-col flex-1">
          <div class="text-text9 text-xxs flex flex-row items-center">
            <span>{{ data.year }}</span>
            <span class="px-1">•</span>
            <span>{{ duration }}</span>
          </div>
          <div class="flex flex-row items-center justify-start -ml-1">
            <Techno v-for="techno of data.technos" :key="techno" :techno="techno" size="sm" />
          </div>
        </div>
      </div>
    </template>
  </PlaceholderAnimatedItem>
</template>

<script lang="ts">
import { ProgressList } from '@models';
import { Component, Vue, Prop, Ref } from 'nuxt-property-decorator';
import { Location } from 'vue-router';
import Techno from '../Techno.vue';
import { VideoProgressModule } from '@store';
import PlaceholderAnimatedItem from '../PlaceholderAnimatedItem.vue';
import { Experience } from 'models/xp.model';
import { monthsToYearsAndMonths } from '@utils';

@Component({
  components: {
    Techno,
    PlaceholderAnimatedItem,
  },
})
export default class ExperiencePlaceholder extends Vue {
  @Prop() data!: Experience;
  @Prop({ default: true }) inCarrousel!: boolean;

  public videoProgress: ProgressList | null = null;

  get picture() {
    return this.data.logo;
  }

  get toPreviewLink(): Location {
    return {
      path: this.$route.path,
      query: {
        ...this.$route.query,
        jbv: this.data.id,
      },
    };
  }

  get duration() {
    return monthsToYearsAndMonths(this.data.duration);
  }
}
</script>

<style lang="postcss" scoped>
.Preview {
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: -1;
    box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    background-color: transparent;
    @apply rounded;
  }

  &.hasShadow {
    &::after {
      opacity: 1;
    }
  }
}
</style>
