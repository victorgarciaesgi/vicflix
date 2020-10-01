<template>
  <div class="NavTab / flex h-full mx-2">
    <nuxt-link :to="route.link" :exact="route.exact" class="NavLink / flex h-full">
      <SvgIcon v-if="route.icon" :src="route.icon" :size="22" class="Icon" />
      <span class="md:hidden ml-1">{{ route.label }}</span>
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { NavLink } from '@models';

@Component
export default class NavTab extends Vue {
  @Prop() route!: NavLink;
  @Prop() list!: boolean;
  @Prop() responsive!: boolean;
}
</script>

<style lang="postcss" scoped>
@keyframes navHover {
  from {
    width: 0;
    left: 50%;
  }
  to {
    width: 100%;
    left: 0;
  }
}

a.NavLink {
  align-items: center;
  justify-content: center;
  color: var(--text10);
  height: 100%;
  padding: 8px 10px;
  font-size: 16px;
  font-weight: bold;
  flex: 0 0 auto;
  border-radius: 5px;
  transition: color 0.1s ease-in-out;

  &::after {
    content: '';
    display: none;
    position: absolute;
    width: 100%;
    height: 4px;
    bottom: 0;
    border-radius: 1px;
    transition: background-color 0.2s ease-in-out;
  }
  &.nuxt-link-active {
    border-radius: 5px;
    color: var(--text1);
    &:after {
      display: block;
      background-color: var(--text1);
      animation: navHover 0.3s;
    }
  }
  &:hover:not(.nuxt-link-active) {
    color: var(--text1);
    &:after {
      display: block;
      background-color: var(--text1);
      animation: navHover 0.3s;
    }
  }
}
</style>
