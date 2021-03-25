<template>
  <nav class="flex flex-row">
    <NavTab
      class="lg:hidden sm:flex"
      v-for="navLink of routes"
      :key="navLink.label"
      :route="navLink"
    />
    <Popin v-if="showPopin" :width="250">
      <template #content>
        <div class="flex flex-col w-full">
          <NuxtLink
            :exact="navLink.exact"
            class="NavLink / last:border-0 border-g60 hover:bg-bg3 px-2 py-3 text-center border-b"
            v-for="navLink of routes"
            :key="navLink.label"
            :to="navLink.link"
          >
            {{ $t(navLink.label) }}
          </NuxtLink>
        </div>
      </template>
      <template #button="{ active }">
        <div class="text-md flex flex-row items-center">
          <span class="mr-2">Parcourir</span>
          <SvgIcon :src="`table/table_sort_${active ? 'up' : 'down'}`" :size="10" />
        </div>
      </template>
    </Popin>
  </nav>
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator';
import { NavLink } from '@models';
import NavTab from './NavTab.vue';
import { BreakpointMixin } from '@mixins';

@Component({ components: { NavTab } })
export default class NavBar extends BreakpointMixin {
  @Prop({ required: true }) routes!: NavLink[];

  get showPopin() {
    return this.isLarge && !this.isMobile;
  }
}
</script>

<style lang="postcss" scoped>
.NavLink {
  &.nuxt-link-active {
    color: var(--red);
  }
}
</style>
