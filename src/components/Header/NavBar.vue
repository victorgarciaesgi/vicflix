<template>
  <nav class="flex flex-col pt-10 shadow-lg">
    <div class="center flex mb-10">
      <img src="~@images/logos/logo.svg" class="w-32" />
    </div>
    <div class="flex flex-col px-4">
      <NavTab v-for="navLink of routes" :key="navLink.label" :route="navLink" />
    </div>
    <img src="~@images/misc/bars.svg" class="absolute bottom-0 w-full -mb-3" />
  </nav>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from 'nuxt-property-decorator';
import { AuthModule } from '@store';
import { NavLink } from '@models';
import NavTab from './NavTab.vue';

@Component({ components: { NavTab } })
export default class NavBar extends Vue {
  @Prop({ required: true }) routes!: NavLink[];

  @Ref() readonly nav!: HTMLElement;
}
</script>

<style lang="postcss" scoped>
nav {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background-color: var(--bg1);
  width: var(--navWidth);
  z-index: 10002;
}
</style>
