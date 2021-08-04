<template>
  <header
    class="text-text1 sm:px-5 sm:py-4 fixed flex items-center justify-between px-10 py-4"
    :class="{ opaque, hideNavBar }"
  >
    <div class="flex-0 flex flex-row items-center">
      <div class="sm:w-10 flex flex-row items-center h-10">
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
      </div>
      <div class="sm:hidden px-8">
        <NavBar :routes="navRoutes" />
      </div>
    </div>

    <div
      class=" Menus / sm:flex-grow sm:justify-end text-text1 flex flex-row items-center flex-shrink-0 ml-5"
    >
      <SearchBar />
      <a href="https://github.com/victorgarciaesgi" target="_blank" class="sm:hidden">
        <SvgIcon src="social/github" :size="20" class="mx-2" />
      </a>
      <a
        href="https://www.linkedin.com/in/victor-garcia-1793b2a9/"
        class="sm:hidden ml-3"
        target="_blank"
      >
        <SvgIcon src="social/linkedin" :size="20" />
      </a>
      <div class="sm:ml-1 ml-4 mr-1">
        <Popin
          :width="180"
          theme="bg3"
          :mode="isMobile ? 'click' : 'hover'"
          :debounce="true"
          :shadow="true"
          :offset="8"
        >
          <template #content>
            <div class="flex flex-col w-full">
              <div
                class=" flex-nowrap hover:bg-bg5 text-text10 first:pt-3 last:pb-3 flex flex-row items-center justify-between px-3 py-2 cursor-pointer"
                v-for="locale of $i18n.locales"
                :key="locale.code"
                @click="setLanguage(locale.code)"
                :class="{ '!text-text1': $i18n.locale === locale.code }"
              >
                <div class="flex flex-row items-center">
                  <img class="w-6 mr-3" :src="`/flags/${locale.code}.png`" />
                  <span class="font-semibold">{{ locale.name }}</span>
                </div>
                <SvgIcon src="forms/done" :size="18" v-if="$i18n.locale === locale.code" />
              </div>
            </div>
          </template>
          <template #button>
            <div class="flex">
              <SvgIcon src="actions/translate" :size="20" />
              <img class="-right-0 -bottom-1 absolute w-3" :src="`/flags/${$i18n.locale}.png`" />
            </div>
          </template>
        </Popin>
      </div>

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
import { BreakpointMixin } from '@mixins';
import { navRoutes } from '@models';
import { AuthModule, RouterModule } from '@store';
import { Component } from 'nuxt-property-decorator';
import { RawLocation } from 'vue-router';
import BurgerMenu from './BurgerMenu.vue';
import NavBar from './NavBar.vue';
import SearchBar from './SearchBar.vue';
import UserPopup from './UserPopup.vue';

@Component({
  components: { NavBar, BurgerMenu, UserPopup, SearchBar },
})
export default class HeaderComponent extends BreakpointMixin {
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

  get availableLanguages() {
    return;
  }

  get userInfos() {
    return AuthModule.state.user;
  }

  get previousLink(): RawLocation {
    const route = this.$route;
    const { jbv, xp, ...rest } = this.$route.query;
    return {
      path: route.path,
      params: route.params,
      query: rest,
    };
  }

  setLanguage(code: string) {
    this.$i18n.setLocale(code);
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
  transition: background-color 0.3s ease-in-out;
  background-color: transparent;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% + 30px);
    transition: opacity 0.3s;

    @mixin dark {
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0));
    }

    @mixin light {
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
    }

    @screen sm {
      height: 100%;
    }
  }

  &.opaque {
    background-color: var(--bg1);
    &::before {
      opacity: 0;
    }
  }

  &.hideNavBar {
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0));
  }
}
</style>
