import Vue from 'vue';
import { VuexModule } from 'vuex-typed-modules';
import { IProgressState } from '@models';
import Colors from '@colors';

let TIMER: NodeJS.Timer | null = null;
let TIMEOUT: NodeJS.Timeout | null = null;
let CUT: number | null = null;

// State
const state: IProgressState = {
  percent: 0,
  show: false,
  canSuccess: true,
  duration: 3000,
  height: '3px',
  color: Colors.blue,
  failedColor: Colors.red1,
  loaderColor: Colors.blue,
  type: null,
};

// Mutations
const mutations = {
  start(state: IProgressState, type: 'loader' | 'progress') {
    if (!state.show) {
      if (TIMEOUT) clearTimeout(TIMEOUT);
      state.type = type;
      state.show = true;
      state.canSuccess = true;
      if (TIMER) {
        clearInterval(TIMER);
        state.percent = 0;
      }
      CUT = 20000 / Math.floor(state.duration);
      TIMER = setInterval(() => {
        if (CUT) {
          state.percent = state.percent + Math.floor(CUT * Math.random());
          if (state.percent > 80 && TIMER) {
            clearInterval(TIMER);
          }
        }
      }, 200);
    }
  },
  set(state: IProgressState, num: number) {
    state.show = true;
    state.canSuccess = true;
    state.percent = Math.floor(num);
  },
  decrease(state: IProgressState, num: number) {
    state.percent = state.percent - Math.floor(num);
  },
  finish(state: IProgressState) {
    state.percent = 100;
  },
  hide(state: IProgressState) {
    if (TIMER) clearInterval(TIMER);
    TIMER = null;
    TIMEOUT = setTimeout(() => {
      state.show = false;
      state.percent = 0;
      Vue.nextTick(() => {
        setTimeout(() => {
          state.percent = 0;
        }, 200);
      });
    }, 400);
  },
  fail(state: IProgressState) {
    state.canSuccess = false;
  },
};

// Module
export const ProgressBarModule = new VuexModule({ name: 'ProgressBarModule', state, mutations });
