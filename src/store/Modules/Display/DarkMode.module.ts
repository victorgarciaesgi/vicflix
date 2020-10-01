import { VuexModule } from 'vuex-typed-modules';

const media = process.browser ? window.matchMedia('(prefers-color-scheme: dark)') : null;

export type DisplayTheme = 'dark' | 'light';

const mediaListenerFn = (ev) => {
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

const actions = {
  setTheme(_, data: DisplayTheme) {
    DarkModeModule.helpers.updateState({
      theme: data,
    });
    document.body.setAttribute('data-theme', data);
  },
  toggleAutoTheme() {
    const value = !DarkModeModule.state.autoTheme;
    DarkModeModule.helpers.updateState({
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
    if (media) media.addListener(mediaListenerFn);
  },
  disableAutoDetection() {
    if (media) media.removeListener(mediaListenerFn);
  },
};

export const DarkModeModule = new VuexModule({
  name: 'DarkModeModule',
  state,
  actions,
});
