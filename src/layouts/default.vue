<template>
  <div id="app" class="flex">
    <ToastContainer />
    <AlertsContainer />
    <portal-target multiple style="z-index: 20000" class="fixed top-0 left-0" name="Popup-Outlet" />
    <div id="rootView">
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import { Store } from 'vuex';
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';
import { EventBus, Events } from '@services';
import { AlertsContainer, ProgressBar, ToastContainer } from '@components';
import { AlertsModule, AuthModule, DarkModeModule, DisplayTheme, ToastModule } from '@store';
import { SuccessToast } from '@constructors';
import { IToastNotificationType } from '@models';

@Component({
  components: {
    AlertsContainer,
    ProgressBar,
    ToastContainer,
  },
})
export default class App extends Vue {
  get isVisible() {
    return !AuthModule.state.hideHeader;
  }

  @Watch('isVisible', { immediate: true })
  headerChanged(value) {
    if (process.browser) {
      if (value) {
        document.documentElement.style.setProperty('--headerHeight', '70px');
      } else {
        document.documentElement.style.setProperty('--headerHeight', '0px');
      }
    }
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
        DarkModeModule.actions.setTheme('light');
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
    display: flex;
  }
}
</style>
