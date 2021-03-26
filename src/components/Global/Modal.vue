<template>
  <Portal to="Modal-Outlet">
    <transition name="bounce">
      <div
        v-if="show"
        class="ModalBase / center flex"
        :class="{ full: !isPopup, fitWindow }"
        @click="closeModal"
        @scroll.stop
      >
        <div
          class="ModalWindow / to-animate c-row-y flex"
          :style="{
            height: height ? `${height}px` : '',
            width: width ? `${width}px` : '',
          }"
          @click.stop="emitClosePopup"
        >
          <template v-if="!onlyContent">
            <div v-if="$slots.header" class="header">
              <div class="header-slot">
                <slot name="header"></slot>
              </div>
              <div class="close-wrap">
                <SvgIcon pointer src="notifications/quit" :size="24" @click.prevent="closeModal" />
              </div>
            </div>
            <div class="content flex">
              <slot name="content"></slot>
            </div>
            <div v-if="$slots.footer" class="footer flex" :class="{ footerShadow }">
              <slot name="footer"></slot>
            </div>
          </template>
          <template v-else>
            <slot></slot>
          </template>
        </div>
      </div>
    </transition>
  </Portal>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'nuxt-property-decorator';
import { EventBus, Events } from '@services';

@Component({})
export default class UIModal extends Vue {
  @Prop({ required: true, type: Boolean })
  show!: boolean;
  @Prop({ default: true })
  isPopup!: boolean;
  @Prop({ required: false })
  height?: number;
  @Prop({ required: false })
  width?: number;
  @Prop({ default: false })
  fitWindow!: boolean;
  @Prop({ default: false })
  onlyContent!: boolean;
  @Prop({ default: false })
  footerShadow!: boolean;

  closeModal() {
    this.$emit('update:show', false);
    this.$emit('close');
  }

  emitClosePopup() {
    EventBus.$emit(Events.CLOSE_POPUPS);
  }
}
</script>

<style lang="postcss">
.ModalBase {
  position: fixed;
  height: 100%;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  left: 0;
  top: 0;
  width: 100vw;
  background-color: rgba(20, 20, 20, 0.7);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100500;

  .ModalWindow {
    display: flex;
    position: relative;
    background-color: var(--bg1);
    border-radius: 3px;
    box-shadow: 0 0 10px rgba(20, 20, 20, 0.2);
    height: auto;
    flex: 0 1 auto;
    min-height: 100px;
    min-width: 300px;
    width: auto;
    flex-flow: column nowrap;
    overflow: hidden;
    max-height: 90%;

    div.header {
      display: flex;
      flex-flow: row wrap;
      flex: 0 0 auto;
      height: 40px;
      padding-left: 10px;
      font-weight: bold;

      div.header-slot {
        display: flex;
        flex: 1;
        align-items: center;
      }

      div.close-wrap {
        display: flex;
        width: 40px;
        cursor: pointer;
        flex: 0 0 auto;
        justify-content: center;
        align-items: center;
      }
    }

    div.content {
      display: flex;
      position: relative;
      flex-flow: column wrap;
      flex: 0 1 auto;
    }

    div.footer {
      display: flex;
      flex-flow: row wrap;
      flex: 0 0 auto;
      padding: 5px 10px;
      padding-bottom: 10px;
      min-height: 50px;
      align-items: center;
      align-content: center;
      justify-content: space-around;

      &.footerShadow {
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
      }
    }
  }

  &.full {
    z-index: 2;
    background-color: var(--bg2);

    .ModalWindow {
      border-radius: 5px;
    }
  }

  &.fitWindow {
    max-height: 100vh;
    max-width: 100vw;
    overflow: hidden;

    .ModalWindow {
      max-height: calc(100vh - 40px);
      max-width: calc(100vw - 40px);
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
