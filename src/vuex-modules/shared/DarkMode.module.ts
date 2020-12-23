import { VuexModule } from 'vuex-typed-modules';

const media = process.browser ? window.matchMedia('(prefers-color-scheme: dark)') : null;

export type DisplayTheme = 'dark' | 'light';

const mediaListenerFn = (ev: MediaQueryListEvent) => {
  DarkModeModule.actions.setTheme(ev.matches ? 'dark' : 'light');
};

interface DarkModeState {
  theme: DisplayTheme;
  autoTheme: boolean;
}

const state: DarkModeState = {
  theme: 'light',
  autoTheme: false,
};

export const DarkModeModule = new VuexModule({
  name: 'DarkModeModule',
  state,
  actions: {
    setTheme({ state }, data: DisplayTheme) {
      DarkModeModule.updateState(() => ({
        theme: data,
      }));
      document.querySelector('html')?.classList.remove(data === 'dark' ? 'light' : 'dark');
      document.querySelector('html')?.classList.add(data);
    },
    toggleAutoTheme({ state }) {
      const value = !state.autoTheme;
      DarkModeModule.updateState({
        autoTheme: value,
      });
      localStorage.setItem('autoTheme', String(value));
      if (value) {
        localStorage.removeItem('displayMode');
        DarkModeModule.actions.enableAutoDetection();
      } else {
        DarkModeModule.actions.disableAutoDetection();
      }
    },
    enableAutoDetection() {
      DarkModeModule.actions.setTheme(media?.matches ? 'dark' : 'light');
      if (media) media.addEventListener('change', mediaListenerFn);
    },
    disableAutoDetection() {
      if (media) media.removeEventListener('change', mediaListenerFn);
    },
  },
});
