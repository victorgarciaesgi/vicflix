<template>
  <nav class="flex flex-row justify-center h-full">
    <NavTab v-for="navLink of routes" :key="navLink.label" :route="navLink" />
  </nav>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from 'nuxt-property-decorator';
import { AuthModule } from '@store';
import { NavLink } from '@models';
import NavTab from './NavTab.vue';

@Component({ components: { NavTab } })
export default class NavBar extends Vue {
  @Prop() routes!: NavLink[];
  @Ref() readonly nav!: HTMLElement;
}
</script>
