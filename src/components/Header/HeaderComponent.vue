<template>
  <header
    class="text-text1 sm:px-5 sm:py-4 fixed flex items-center justify-between px-10 py-4"
    :class="{ opaque, hideNavBar }"
  >
    <div class="flex-0 flex flex-row items-center">
      <NuxtLink v-if="!hideNavBar" to="/">
        <img
          class="sm:hidden hover:scale-105 transition-transform duration-200 transform"
          src="@images/vicflix.png"
          width="90"
        />
        <img class="-sm:hidden" src="/icon.png" width="24" />
      </NuxtLink>
      <NuxtLink v-else :to="previousLink">
        <SvgIcon class="-sm:hidden" src="videos/back" :size="34" />
      </NuxtLink>
      <div class="sm:hidden px-8">
        <NavBar :routes="navRoutes" />
      </div>
    </div>

    <div class="Menus / sm:flex-grow sm:justify-end flex flex-row items-center flex-shrink-0 ml-5">
      <SearchBar />
      <a href="https://github.com/victorgarciaesgi" target="_blank" class="sm:hidden">
        <SvgIcon src="social/github" :size="20" class="mx-1" />
      </a>
      <a
        href="https://www.linkedin.com/in/victor-garcia-1793b2a9/"
        class="sm:hidden ml-4"
        target="_blank"
      >
        <SvgIcon src="social/linkedin" :size="20" class="mr-2" />
      </a>
      <div class="flex ml-3">
        <UserPopup />
      </div>
    </div>
    <div v-if="!hideNavBar" class="-sm:hidden flex flex-col items-center w-full">
      <NavBar :routes="navRoutes" />
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { AuthModule, RouterModule } from '@store';
import { navRoutes } from '@models';
import BurgerMenu from './BurgerMenu.vue';
import NavBar from './NavBar.vue';
import UserPopup from './UserPopup.vue';
import SearchBar from './SearchBar.vue';
import { Location, RawLocation } from 'vue-router';

@Component({
  components: { NavBar, BurgerMenu, UserPopup, SearchBar },
})
export default class HeaderComponent extends Vue {
  public showBurger = false;
  public navRoutes = navRoutes;
  public opaque = false;

  get isLoggedIn() {
    return AuthModule.state.loggedIn;
  }

  get hideNavBar() {
    return AuthModule.state.hideNav;
  }

  get currentTitle() {
    return RouterModule.state.currentTitle;
  }

  get userInfos() {
    return AuthModule.state.user;
  }

  get previousLink(): RawLocation {
    const previous = RouterModule.state.previousRoute;
    if (previous) {
      return {
        path: previous.path,
        params: previous.params,
      };
    }
    return '/';
  }

  checkHeaderOpaque() {
    if (!this.hideNavBar) {
      if (window.pageYOffset > 0) {
        this.opaque = true;
      } else {
        this.opaque = false;
      }
    }
  }

  mounted() {
    window.addEventListener('scroll', this.checkHeaderOpaque);
    window.addEventListener('resize', this.checkHeaderOpaque);
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.checkHeaderOpaque);
    window.removeEventListener('resize', this.checkHeaderOpaque);
  }
}
</script>

<style lang="postcss">
header {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 10003;
  flex-flow: row nowrap;
  transition: background-color 0.4s ease-in-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0));

    @screen sm {
      height: 100%;
    }
  }

  &.opaque {
    background: black;
  }

  &.hideNavBar {
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0));
  }
}
</style>
