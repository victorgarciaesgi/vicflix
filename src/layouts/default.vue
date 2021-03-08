<template>
  <div id="app" class="flex">
    <ToastContainer />
    <AlertsContainer />
    <HeaderComponent v-if="loggedIn" />
    <PortalTarget multiple style="z-index: 11000" class="fixed top-0 left-0" name="Popup-Outlet" />
    <PortalTarget multiple style="z-index: 10600" class="fixed top-0 left-0" name="Modal-Outlet" />
    <PortalTarget
      multiple
      style="z-index: 10500"
      class="fixed top-0 left-0"
      name="Preview-Outlet"
    />

    <div id="rootView" class="c-row-y flex flex-row">
      <Nuxt />
      <FooterComponent />
    </div>
    <transition name="fade">
      <ProfileSelect v-if="!loggedIn" />
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';
import {
  AlertsContainer,
  ToastContainer,
  HeaderComponent,
  ProfileSelect,
  FooterComponent,
} from '@components';
import { AuthModule, DarkModeModule, DisplayTheme, RouterModule } from '@store';

@Component({
  components: {
    AlertsContainer,
    ToastContainer,
    HeaderComponent,
    ProfileSelect,
    FooterComponent,
  },
})
export default class App extends Vue {
  get loggedIn() {
    return AuthModule.state.loggedIn;
  }
  created() {
    if (process.browser) {
      const storedPreference = localStorage.getItem('displayMode');
      const autoTheme = localStorage.getItem('autoTheme') === 'true';
      if (autoTheme) {
        DarkModeModule.actions.enableAutoDetection();
      } else if (storedPreference) {
        DarkModeModule.actions.setTheme(storedPreference as DisplayTheme);
      } else {
        DarkModeModule.actions.setTheme('dark');
      }
    }
    if (process.browser) {
      document.addEventListener('touchstart', (e) => {}, { passive: true });
      document.addEventListener('touchmove', (e) => {}, { passive: true });
    }
  }
}
</script>

<style lang="postcss">
div#app {
  position: relative;
  width: 100%;
  flex: 1;
  max-width: 100%;

  #rootView {
    position: relative;
    width: 100%;
    max-width: 100%;
    flex: 1;
    /* padding-top: var(--headerHeight); */
  }
}
</style>
