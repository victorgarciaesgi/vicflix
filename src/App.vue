<template>
  <div id="app" @click="closePopups" v-cloak>
    <transition name="bounce">
      <Alerts v-if="alertState" />
    </transition>
    <Notifications />
    <div class="rootView">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <router-view />
        </keep-alive>
      </transition>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { Store } from 'vuex';
import { Component, Prop } from 'vue-property-decorator';
import { EventBus, Events } from '@services';
import { Alerts, Notifications } from '@components';
import { NotificationsModule, AlertsModule, GlobalModule } from '@store';

@Component({
  components: {
    Alerts,
    Notifications,
  },
})
export default class App extends Vue {
  get alertState() {
    return AlertsModule.state.alertShow;
  }

  checkMobile() {
    if (window.innerWidth < 480 && !GlobalModule.state.mobile) {
      GlobalModule.mutations.updateGlobalState({
        mobile: true,
      });
    } else if (window.innerWidth >= 480 && GlobalModule.state.mobile) {
      GlobalModule.mutations.updateGlobalState({
        mobile: false,
      });
    }
  }

  created() {
    window.addEventListener('resize', () => {
      EventBus.$emit(Events.CLOSE_POPUPS);
      this.checkMobile();
    });
    this.checkMobile();
  }

  closePopups() {
    EventBus.$emit(Events.CLOSE_POPUPS);
  }
}
</script>


<style lang='scss' scoped>
div#app {
  height: 100%;
  position: relative;
  width: 100%;
  max-width: 100%;

  .rootView {
    position: absolute;
    display: flex;
    flex-flow: row nowrap;
    align-items: stretch;
    left: 0;
    width: 100%;
    max-width: 100%;
    min-height: 100%;
  }

  .loader {
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    width: 100%;
    height: 100%;
    align-items: center;
    background-color: var();
    color: white;

    span {
      margin-top: 20px;
    }
  }
}
</style>