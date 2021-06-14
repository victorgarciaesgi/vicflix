<template>
  <PlaceholderAnimatedItem
    :baseInfo="data"
    :picture="picture"
    :inCarrousel="inCarrousel"
    :showProgress="false"
    :previewLink="toPreviewLink"
    class="max-w-[250px]"
  >
    <template #card>
      <VImg background="bg3" type="default" :src="picture" class="rounded" />
      <SvgIcon
        src="social/school"
        class="left-3 bottom-3 absolute w-8 h-8 overflow-hidden"
        style="filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.6))"
      />
    </template>
    <template #preview>
      <SvgIcon
        src="social/school"
        class="left-3 bottom-3 absolute w-8 h-8 overflow-hidden"
        style="filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.6))"
      />
    </template>
    <template #picture>
      <img :src="picture" class="object-cover w-full h-full rounded-tl rounded-tr" />
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
        <div class="c-row-y flex flex-1">
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
        xp: this.data.id,
      },
    };
  }

  get duration() {
    return monthsToYearsAndMonths(this.data.duration);
  }
}
</script>
