import Vue from 'vue';
export const EventBus = new Vue();

export const Events = {
  CLOSE_POPUPS: 'closePopups',
  BOX_CHANGED: 'boxChanged',
  NEW_WOD: 'newWod',
};
