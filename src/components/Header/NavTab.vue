<template>
  <div class="NavTab / flex flex-col w-full my-1">
    <nuxt-link
      :to="route.link"
      :exact="route.exact"
      class="NavLink flex items-center h-full px-3 py-2 rounded-lg"
    >
      <SvgIcon v-if="route.icon" :src="route.icon" class="Icon w-5" />
      <span class="text-md ml-3 font-semibold">{{ route.label }}</span>
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { NavLink } from '@models';

@Component
export default class NavTab extends Vue {
  @Prop() route!: NavLink;
}
</script>

<style lang="postcss" scoped>
a.NavLink {
  color: var(--green);
  &.nuxt-link-active {
    color: white;
    background: var(--buttonGreen);
  }
  &:hover:not(.nuxt-link-active) {
    background-color: var(--bg3);
  }
}
</style>
