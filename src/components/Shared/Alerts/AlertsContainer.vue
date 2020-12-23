<template>
  <transition name="bounce">
    <div v-if="showAlert" ref="baseAlert" class="Alert-Container" @mousedown="deleteLastAlert">
      <transition-group name="bounce">
        <Alert v-for="alert of alertList" :key="alert.id" :alert="alert" />
      </transition-group>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'nuxt-property-decorator';
import { AlertsModule } from '@store';
import Colors from '@colors';
import Alert from './Alert.vue';

@Component({
  components: {
    Alert,
  },
})
export default class AlertsContainer extends Vue {
  $refs!: {
    baseAlert: HTMLElement;
  };

  get alertList() {
    return AlertsModule.state.alertsList;
  }
  get showAlert() {
    return AlertsModule.state.alertsList.length > 0;
  }

  deleteLastAlert() {
    const [first] = this.alertList;
    AlertsModule.actions.deleteAlert(first.id);
  }
}
</script>

<style lang="postcss" scoped>
div.Alert-Container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  z-index: 11000;
  padding: 10px;
  background-color: rgba(40, 40, 40, 0.7);
}
</style>
