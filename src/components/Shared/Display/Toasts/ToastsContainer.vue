<template>
  <client-only>
    <template #default>
      <div class="ToastContainer / flex">
        <transition-group name="toast" tag="div" class="flex flex-col-reverse">
          <Toast v-for="element of toastList" :key="element.id" :toast="element" />
        </transition-group>
      </div>
    </template>
    <template #placeholder>
      <span></span>
    </template>
  </client-only>
</template>

<script lang="ts">
import { ToastModule } from '@store';
import { Component, Vue } from 'nuxt-property-decorator';
import Toast from './Toast.vue';

@Component({
  components: { Toast },
})
export default class ToastContainer extends Vue {
  get toastList() {
    return ToastModule.state.toastList;
  }
}
</script>

<style lang="postcss" scoped>
div.ToastContainer {
  position: fixed;
  z-index: 10005;
  bottom: 0;
  left: 0;
  /* transition: top 0.2s; */
}

.toast-enter-active {
  transition: opacity 0.2s, transform 0.2s;
}

.toast-leave-active {
  position: absolute;
  transition: opacity 0.2s, transform 0.2s;
}

.toast-leave-to,
.toast-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.toast-enter-to,
.toast-leave {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.toast-move {
  transition: transform 0.2s;
}
</style>
