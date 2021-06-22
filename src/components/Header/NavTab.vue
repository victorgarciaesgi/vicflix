<template>
  <div class="NavTab / flex flex-col my-1">
    <nuxt-link
      :to="route.link"
      :exact="route.exact"
      class="NavLink text-text4 sm:px-1 flex items-center px-2 py-2 font-normal"
    >
      <span class="text-md ml-3">{{ $t(route.label) }}</span>
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
  transition: color 0.2s ease-in, font-weight 0.2s ease-in;
  &.nuxt-link-active {
    @apply text-text1 font-semibold;
  }
  &:hover:not(.nuxt-link-active) {
    @apply text-text6;
  }
}
</style>
