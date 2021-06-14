<template>
  <PlaceholderAnimatedItem :baseInfo="data" :showProgress="false" :inCarrousel="inCarrousel">
    <template #card>
      <div class="center flex w-full h-full rounded" :style="{ backgroundColor: data.color }">
        <SvgIcon :src="logo" color="w230" :size="110" />
      </div>
    </template>
    <template #picture>
      <div
        class="center flex w-full h-full rounded-tl rounded-tr"
        :style="{ backgroundColor: data.color }"
      >
        <SvgIcon
          :src="logo"
          :size="110"
          color="w230"
          class=" left-1/2 top-1/2 absolute overflow-hidden transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </template>
    <template #previewBlock>
      <div class="Block / flex-nowrap flex flex-row">
        <div class="flex flex-col flex-1">
          <h4 class="leading-5">{{ data.title }}</h4>
          <span class="text-w160 text-xs">{{
            $tc($messages.Skills.Project, projectConcerned)
          }}</span>
        </div>
        <div class="flex-nowrap flex-0 flex flex-row items-center ml-1">
          <Popin mode="hover" :offset="2" theme="text1">
            <template #content>
              <span class="text-bg1 px-3 py-1">Rechercher</span>
            </template>
            <template #button>
              <div
                @click.stop="toSearchLocation"
                class="center text-bg1 bg-text1 border-text1 flex p-1 border-2 rounded-full"
              >
                <SvgIcon src="actions/search" :size="20" />
              </div>
            </template>
          </Popin>
        </div>
      </div>
    </template>
  </PlaceholderAnimatedItem>
</template>

<script lang="ts">
import { allProjects } from '@data';
import { routerPagesNames, Skill } from '@models';
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import PlaceholderAnimatedItem from '../PlaceholderAnimatedItem.vue';

@Component({
  components: {
    PlaceholderAnimatedItem,
  },
})
export default class SkillPlaceholder extends Vue {
  @Prop() data!: Skill;
  @Prop({ default: false }) inCarrousel!: boolean;

  toSearchLocation() {
    this.$router.push({
      name: routerPagesNames.search,
      query: {
        q: this.data.title,
      },
    });
  }

  get projectConcerned() {
    return allProjects.filter((f) => f.technos.includes(this.data.title)).length;
  }

  get logo() {
    return this.data.logo;
  }
}
</script>
