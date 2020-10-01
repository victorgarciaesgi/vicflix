<template>
  <div class="ToastContainer / flex">
    <transition-group name="toast">
      <Toast v-for="element of toastList" :key="element.id" :toast="element" />

      <!-- <div
          v-if="'name' in element"
          :key="element.id"
          class="flex px-4"
          :style="{ paddingBottom: `${20 + (element.list.length - 1) * 15}px` }"
        >
          <div class="relative flex">
            <transition-group name="toast-child" class="relative flex">
              <Toast
                v-for="(toast, index) of element.list"
                :key="toast.id"
                :index="index"
                :toast="toast"
                :list-length="element.list.length"
                namespaced
              />
            </transition-group>
          </div>
        </div> -->
    </transition-group>
  </div>
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
  z-index: 10001;
  top: var(--headerHeight);
  transition: top 0.2s;
}

.toast-enter-active {
  transition: opacity 0.2s, transform 0.2s;
}

.toast-leave-active:not(:first-child):not(:last-child) {
  position: absolute;
  transition: opacity 0.2s, transform 0.2s;
}

.toast-leave-to {
  opacity: 0;
  transform: translate3d(0, 0, 0);
}

.toast-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.toast-enter-to {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.toast-move {
  transition: transform 0.2s;
}
</style>
