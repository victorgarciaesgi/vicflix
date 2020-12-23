<template>
  <header
    class="bg-bg1 text-text1 pl-5p border-bg3 lg:pl-5 fixed flex items-center justify-between pr-5 border-b"
  >
    <div class="absolute top-0 left-0 z-0 w-full h-full overflow-hidden">
      <img
        src="~@images/misc/circles_thin.svg"
        class="w-96 h-96 absolute top-0 left-0 mt-10 ml-8 transform -translate-x-1/2 -translate-y-1/2 opacity-75"
      />
    </div>
    <div class="Title text-green leading-1 lg:text-2xl flex ml-12 text-4xl font-semibold">
      <span class="--GradientText py-1">{{ currentTitle }}</span>
    </div>
    <div class="Menus / flex items-center flex-shrink-0 ml-5">
      <div class="flex ml-3">
        <UserPopup />
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { AuthModule, RouterModule } from '@store';
import { NavLink, routerPagesNames } from '@models';
import BurgerMenu from './BurgerMenu.vue';
import NavBar from './NavBar.vue';
import UserPopup from './UserPopup.vue';

@Component({
  components: { NavBar, BurgerMenu, UserPopup },
})
export default class HeaderComponent extends Vue {
  public showBurger = false;
  get isLoggedIn() {
    return AuthModule.state.loggedIn;
  }

  get currentTitle() {
    return RouterModule.state.currentTitle;
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
  left: var(--navWidth);
  height: var(--headerHeight);
  width: calc(100vw - var(--navWidth));
  z-index: 10003;
  flex-flow: row nowrap;
  min-width: 800px;
}
</style>
