<template>
  <header class="text-text1 fixed flex items-center justify-between px-10" :class="{ opaque }">
    <div class="flex-0 flex flex-row items-center">
      <img src="@images/vicflix.png" width="90" />
      <div class="px-8">
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
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { AuthModule, RouterModule } from '@store';
import { NavLink, navRoutes, routerPagesNames } from '@models';
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

  get currentTitle() {
    return RouterModule.state.currentTitle;
  }

  get userInfos() {
    return AuthModule.state.user;
  }

  mounted() {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 0) {
        this.opaque = true;
      } else {
        this.opaque = false;
      }
    });
  }
}
</script>

<style lang="postcss">
header {
  position: fixed;
  top: 0px;
  left: 0px;
  height: var(--headerHeight);
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
    background-color: rgba(0, 0, 0, 0.8);
  }
}
</style>
