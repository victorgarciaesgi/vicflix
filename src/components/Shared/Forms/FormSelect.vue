<template>
  <div class="input-box" :class="{ noMargin: data.noMargin }">
    <label :for="formId" v-if="data.label" class="input-label">
      {{ label }}
    </label>
    <Popup :selectMode="true" ref="popup" :shadow="false">
      <ul slot="popup" class="options-list flex">
        <li
          class="option flex"
          v-for="option of data.options"
          :key="option.value"
          :class="{ selected: option.value === value }"
          @click="selectOption(option.value)"
        >
          <span class="value ellipsis">{{ option.text }}</span>
          <div class="icon" v-if="option.value === value">
            <SvgIcon src="icons/Forms/done.svg" color="primary" />
          </div>
        </li>
      </ul>

      <div slot="button" class="input-container select">
        <div class="display-text flex">
          <div v-if="data.icon" class="icon">
            <SvgIcon
              :src="data.icon"
              :size="24"
              :color="{
                [css.green]: valid && dirty && data.error && !isPending,
                [css.red]: !valid && dirty && data.error && !isPending,
              }"
            />
          </div>
          <div class="infos flex column">
            <span class="placeholder ellipsis" :class="{ top: !!getDisplayValue }">
              {{ placeholder }}
            </span>
            <span class="value ellipsis" v-if="getDisplayValue">{{ getDisplayValue }}</span>
          </div>
          <div class="icon-collapse flex center">
            <SvgIcon class="arrow" src="icons/Forms/unfold.svg" :size="20" />
          </div>
        </div>
      </div>
    </Popup>
    <FormError v-if="vl" :vl="vl" :data="data" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Mixin, Mixins } from 'vue-mixin-decorator';
import { FormMixin } from '../../Mixins/FormMixin';
import FormError from './FormError.vue';
import Popup from '../Display/Popup.vue';
import { oc } from 'ts-optchain';

@Component({
  components: {
    FormError,
  },
})
export default class FormSelect extends FormMixin {
  $refs: {
    popup: Popup;
  };

  get getDisplayValue() {
    return oc(this.data.options.find(f => f.value === this.value)).text();
  }

  selectOption(value: any) {
    this.updateValue(value);
    this.$refs.popup.closePopup();
  }
}
</script>



<style lang='scss' scoped>
@import './styles/formStyles';

ul.options-list {
  flex-flow: column wrap;
  width: 100%;

  li.option {
    flex-flow: row nowrap;
    height: 40px;
    align-items: center;

    span.value {
      flex: 1 1 auto;
      padding-left: 10px;
    }
    div.icon {
      flex: 0 0 auto;
      padding: 10px;
    }
  }
}

div.display-text {
  height: 100%;
  width: 100%;
  flex-flow: row nowrap;
  text-align: left;

  div.infos {
    flex: 1 1 auto;
    justify-content: center;
    padding-left: 10px;

    span.placeholder {
      color: $w110;
      transition: font-size 0.2s;

      &.top {
        font-size: 12px;
      }
    }

    span.value {
      font-weight: bold;
    }
  }

  div.icon-collapse {
    flex: 0 0 auto;
    padding: 10px;
  }
}
</style>

