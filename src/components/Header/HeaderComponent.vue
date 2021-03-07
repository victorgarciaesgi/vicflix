<template>
  <header
    class="text-text1 sm:px-5 sm:py-4 fixed flex items-center justify-between px-10 py-4"
    :class="{ opaque, hideNavBar }"
  >
    <div class="flex-0 flex flex-row items-center">
      <NuxtLink to="/">
        <img class="sm:hidden" src="@images/vicflix.png" width="90" />
        <img v-if="!hideNavBar" class="-sm:hidden" src="/icon.png" width="24" />
        <SvgIcon v-else class="-sm:hidden" src="videos/back" :size="34" />
      </NuxtLink>
      <div class="sm:hidden px-8">
        <NavBar :routes="navRoutes" />
      </div>
    </div>

    <div class="Menus / flex items-center flex-shrink-0 ml-5">
      <SvgIcon src="actions/search" :size="28" class="mx-2" />
      <SvgIcon src="alerts/notif" :size="28" class="mx-2" />
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

@Component({
  components: { NavBar, BurgerMenu, UserPopup },
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
  }

  &.opaque {
    background: black;
  }

  &.hideNavBar {
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0));
  }
}
</style>
