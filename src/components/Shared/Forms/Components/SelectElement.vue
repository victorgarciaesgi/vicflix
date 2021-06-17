<template>
  <FormElementBase ref="formElementRef" v-bind="baseProps">
    <Popin
      ref="popin"
      :disabled="data.disabled"
      :full="true"
      :arrow="false"
      :rounded="false"
      :offset="3"
      :container="container"
      :nested="data.nested"
      @open="handleFocus"
      @close="handleBlur"
    >
      <template #content>
        <div class="flex-nowrap flex flex-col w-full h-full">
          <div v-if="isSearch" class="flex flex-grow-0 flex-shrink-0 w-full p-2">
            <SearchField
              v-model="searchValue"
              :full="true"
              size="md"
              @echap="handleEchap"
              @enter="handleEnter"
            />
          </div>
          <div class="flex flex-grow">
            <div class="w-full">
              <ul v-if="dynamicOptionsFiltered.length" list class="OptionsList / flex flex-grow">
                <li
                  v-for="(option, index) of dynamicOptionsFiltered"
                  :key="option.value"
                  :title="option.text"
                  :class="{
                    focused: resultSelected === index,
                    selecting,
                  }"
                  class="OptionItem / flex pr-8"
                  @mouseenter="selecting = false"
                  @click.stop="selectOption(option)"
                >
                  <div class="flex flex-row items-center">
                    <div v-if="atLeastOneIcon" class="image bg-center bg-no-repeat bg-cover">
                      <VImg :src="option.icon" class="rounded" />
                    </div>
                    <span class="value ellipsis">
                      {{ option.text }}
                      <span v-if="option.additional" class="ml-1 text-base font-semibold">{{
                        option.additional
                      }}</span>
                    </span>
                  </div>
                  <!-- <div v-if="option.value === value" class="icon">
                    <SvgIcon :size="22" src="forms/done" color="green" />
                  </div> -->
                </li>
              </ul>

              <div
                v-else-if="hasError"
                class="center text-redError flex w-full px-4 py-2 text-sm text-center"
                >Erreur lors de la récupération des données</div
              >
              <div v-else class="center flex w-full py-2 text-sm text-center"> Aucun résultat </div>
            </div>
          </div>
        </div>
      </template>

      <template #button>
        <div
          :id="formId"
          :tabindex="0"
          :disabled="data.disabled"
          :style="{ width: data.width }"
          class="input-container select w-full"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown.down.up.prevent.stop="updateSelectedResult"
          @keydown.esc.prevent="handleEchap"
          @keydown.enter.prevent="handleEnter"
        >
          <div class="DisplayText / flex">
            <div v-if="data.style && data.style.icon" class="icon">
              <SvgIcon :src="data.style.icon" :size="22" :color="iconColorProps" />
            </div>
            <div class="Infos / flex-nowrap flex flex-col">
              <div v-if="getDisplayValue" class="ellipsis flex-nowrap flex items-center">
                <div
                  v-if="getDisplayValue.icon"
                  :class="{
                    'border-bg4 border': data.userDisplay,
                  }"
                  class="flex-0 relative w-4 h-4 mr-1 bg-center bg-no-repeat bg-cover rounded-md"
                >
                  <VImg :src="getDisplayValue.icon" class="rounded" />
                </div>
                <span class="value ellipsis text-lg">{{ getDisplayValue.text }}</span>
              </div>
            </div>
            <div v-if="value && !data.disabled" class="center flex-0 flex">
              <SvgIcon
                v-if="data.nullable"
                :size="14"
                class="bg-text2 p-px rounded-full"
                src="actions/close"
                color="var(--bg1)"
                @click.native.stop="deleteValue"
              />
            </div>
            <div class="icon-collapse center flex">
              <SvgIcon :size="20" class="arrow" src="forms/unfold" />
            </div>
          </div>
        </div>
      </template>
    </Popin>
  </FormElementBase>
</template>

<script lang="ts">
import { Vue, Prop, Ref, Component, Emit } from 'nuxt-property-decorator';
import { Mixin, Mixins } from 'vue-mixin-decorator';
import { debounce } from 'lodash-es';
import { FormMixin } from '@mixins';
import { SelectField, SelectOption, UnPackField } from '@constructors';
import SearchField from '../../Display/SearchField.vue';
import Popin from '../../../Global/Popin/Popin.vue';

@Component({
  components: {
    SearchField,
  },
})
export default class SelectElement extends FormMixin {
  @Prop() container!: HTMLElement;

  data!: UnPackField<SelectField>;

  @Ref() popin!: Popin;
  @Emit() emitUpdate(value: SelectOption) {
    return value;
  }

  public userImage = require('@images/user.jpg');
  public resultSelected = 0;
  public selecting = true;
  public cachedDisplayValue: SelectOption<any> | null = null;
  public hasError = false;
  public immediate = false;
  public search = '';

  get isSearch() {
    return !!this.data.search;
  }

  get getDisplayValue() {
    if (this.cachedDisplayValue) {
      return this.cachedDisplayValue;
    } else if (this.data.options) {
      return this.data.options.find((f) => f.value === this.value);
    } else {
      return this.dynamicOptions.find((f) => f.value === this.value);
    }
  }

  get searchValue() {
    return this.search;
  }
  set searchValue(value: string) {
    this.search = value;
  }

  get atLeastOneIcon() {
    return (
      this.data?.options?.some((option) => option.icon) ||
      this.dynamicOptions.some((option) => option.icon)
    );
  }

  get dynamicOptions(): SelectOption[] {
    if (this.data.options) {
      return this.data.options;
    }
    return [];
  }

  get dynamicOptionsFiltered() {
    return this.dynamicOptions.filter((result) => {
      if (this.data.innerSearch) {
        return result.text?.toLocaleLowerCase().includes(this.searchValue.toLocaleLowerCase());
      }
      return true;
    });
  }

  handleEnter(event: KeyboardEvent): void {
    if (this.isFocused) {
      if (this.popin.visible && this.dynamicOptionsFiltered) {
        this.selectOption(this.dynamicOptionsFiltered[this.resultSelected]);
        this.popin.closePopup();
      }
    }
  }

  async handleFocus() {
    if (!this.data.disabled) {
      this.isFocused = true;
    }
  }

  handleEchap() {
    this.popin.closePopup();
  }

  updateSelectedResult(event: KeyboardEvent) {
    if (this.isFocused) {
      let touche = event.which - 39;
      this.selecting = true;
      if (
        this.resultSelected + touche >= 0 &&
        this.resultSelected + touche <= this.dynamicOptions.length - 1
      ) {
        this.resultSelected += touche;
      }
      this.selecting = true;
    }
  }

  selectOption({ value, text, icon }: SelectOption) {
    if (value !== this.value) {
      this.cachedDisplayValue = { value, text, icon };
      this.updateValue(value);
      this.emitUpdate({ value, text, icon });
      this.popin.closePopup();
      this.resultSelected = 0;
    }
  }

  deleteValue() {
    if (!this.data.disabled) {
      this.cancelValue();
      this.cachedDisplayValue = null;
      this.selecting = false;
      this.hasError = false;
    }
  }

  created() {
    if (this.data.displayValue) {
      this.cachedDisplayValue = this.data.displayValue;
    }
  }
}
</script>

<style lang="postcss" scoped>
ul.OptionsList {
  flex-flow: column wrap;
  width: 100%;
  border: 1px solid var(--bg10);
  padding: 10px 0;
  background-color: var(--bg5);

  li.OptionItem {
    flex-flow: row nowrap;
    height: 40px;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.1s;
    text-align: left;
    justify-content: space-between;
    background-color: var(--bg5);
    /* &:not(:last-child) {
      border-bottom: 1px solid var(--bg3);
    } */
    span.value {
      padding: 0 10px;
      padding-left: 15px;
      font-size: 18px;
      line-height: 40px;
      color: var(--text1);
      transition: color 0.1s;
      font-weight: bold;
    }

    div.image {
      border-radius: 4px;
      flex: 0 0 auto;
      margin-left: 10px;
      height: 25px;
      width: 25px;
      position: relative;
    }

    div.icon {
      flex: 0 0 auto;
      padding: 10px;
    }

    &.selecting.focused {
      background-color: var(--bg8);
    }

    &.selected {
      font-weight: 600;
      cursor: default;
    }

    &:not(.selecting):hover {
      background-color: var(--bg8);
    }
  }
}

div.DisplayText {
  height: 100%;
  width: 100%;
  flex-flow: row nowrap;
  text-align: left;

  div.Infos {
    flex: 1 1 auto;
    justify-content: center;
    padding-left: 15px;
    font-weight: 500;

    span.placeholder {
      font-weight: 500;
    }

    span.value {
      font-size: 18px;
      font-weight: bold;
    }

    &.top {
      padding: 2px 5px;
      justify-content: space-around;
      span.placeholder {
        font-size: 10px;
      }
    }
  }

  div.icon-collapse {
    flex: 0 0 auto;
    padding-left: 5px;
  }
}
</style>
