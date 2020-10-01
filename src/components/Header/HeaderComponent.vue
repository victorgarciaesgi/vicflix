<template>
  <header class="bg-bg1 text-text1 fixed flex items-center justify-between px-10 shadow">
    <div class="relative flex-1 h-full py-2">
      <img src="~@images/vicflix.png" class="h-full" />
    </div>
    <NavBar :routes="navRoutes" class="mx-auto" />
    <div class="Menus / flex items-center justify-end flex-1">
      <div class="flex ml-3">
        <UserPopup />
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { AuthModule, RouterModule } from '@store';
import { NavLink, routerPagesNames, navRoutes } from '@models';
import BurgerMenu from './BurgerMenu.vue';
import NavBar from './NavBar.vue';
import UserPopup from './UserPopup.vue';

@Component({
  components: { NavBar, BurgerMenu, UserPopup },
})
export default class HeaderComponent extends Vue {
  public showBurger = false;
  public navRoutes = navRoutes;
  get isLoggedIn() {
    return AuthModule.state.loggedIn;
  }

  get currentTitle() {
    return RouterModule.getters.currentRouteTitle;
  }
  get icon() {
    if (this.showBurger) {
      return 'icons/actions/close.svg';
    } else {
      return 'icons/burger.svg';
    }
  }

  get userInfos() {
    return AuthModule.state.user;
  }
}
</script>

<style lang="postcss">
header {
  position: fixed;
  top: 0px;
  left: 0px;
  height: var(--headerHeight);
  width: 100vw;
  z-index: 10002;
  flex-flow: row nowrap;
  min-width: 800px;
}
</style>
