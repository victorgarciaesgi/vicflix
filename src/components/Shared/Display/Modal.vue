<template>
  <transition name="bounce">
    <div
      v-if="show"
      class="modal-base"
      @click="closeModal"
      @scroll.stop
      :class="{ full: !isPopup }"
    >
      <div
        class="modal-window to-animate"
        @click.stop="emitClosePopup()"
        :style="{
          maxHeight: height ? `${height}px` : '',
          width: width ? `${width}px` : '',
        }"
      >
        <template v-if="!onlyContent">
          <div class="header" v-if="isPopup && $slots.header">
            <div class="header-slot">
              <slot name="header"></slot>
            </div>
            <div class="close-wrap">
              <img src="~@icons/notifications/quit.svg" @mousedown.prevent="closeModal" />
            </div>
          </div>
          <div class="content">
            <slot name="content"></slot>
          </div>
          <div class="footer" v-if="$slots.footer" :class="{ footerShadow }">
            <slot name="footer"></slot>
          </div>
        </template>
        <template v-else>
          <slot></slot>
        </template>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { EventBus } from '@services';

@Component({})
export default class UIModal extends Vue {
  @Prop()
  show: boolean;
  @Prop({ required: false, default: true })
  isPopup: boolean;
  @Prop({ required: false })
  height: number;
  @Prop({ required: false })
  width: number;
  @Prop({ required: false })
  autoFull: number;
  @Prop({ required: false })
  onlyContent: boolean;
  @Prop({})
  footerShadow: boolean;

  $slots;

  closeModal() {
    this.$emit('update:show', false);
    this.$emit('close');
  }

  emitClosePopup() {
    EventBus.$emit('closePopups');
  }
}
</script>



<style lang='scss' scoped>
.modal-base {
  position: fixed;
  height: 100%;
  left: 0;
  top: 0;
  width: 100%;
  background-color: transparentize($g20, 0.7);
  display: flex;
  flex-flow: row wrap;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  z-index: 10002;

  &.full {
    z-index: 2;
    background-color: $w245;

    .modal-window {
      border-radius: 5px;
    }
  }

  .modal-window {
    display: flex;
    position: relative;
    background-color: white;
    border-radius: 3px;
    box-shadow: 0 0 20px rgba(20, 20, 20, 0.3);
    height: auto;
    flex: 0 1 auto;
    margin: auto;
    min-height: 200px;
    min-width: 300px;
    width: auto;
    flex-flow: column nowrap;
    overflow: hidden;
    transition: height 0.2s;

    div.header {
      display: flex;
      flex-flow: row wrap;
      flex: 0 0 auto;
      height: 40px;
      padding-left: 10px;
      font-weight: bold;
      border-bottom: 1px solid $w230;

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
      flex: 1 1 auto;
    }

    div.footer {
      display: flex;
      flex-flow: row wrap;
      flex: 0 0 auto;
      padding: 5px;
      min-height: 50px;
      align-items: center;
      align-content: center;
      justify-content: space-around;
      border-top: 1px solid $w230;

      &.footerShadow {
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>

