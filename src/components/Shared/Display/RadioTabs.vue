<template>
  <div class="radio w-around flex">
    <div
      v-for="radio of tabs"
      :key="radio.value"
      :class="{ selected: radio.value === value }"
      class="radio-wrap center flex"
      @click="$emit('input', radio.value)"
    >
      <div v-if="radio.icon" class="center margr5 flex">
        <SvgIcon :src="radio.icon" :size="26" :color="radio.value === value ? 'white' : 'dark'" />
      </div>
      <span>{{ radio.text }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'nuxt-property-decorator';

@Component({
  components: {},
})
export default class RadioTabs extends Vue {
  @Prop() value!: string;
  @Prop() tabs!: RadioTabs;
}
</script>

<style lang="postcss" scoped>
$bgColor: var(--blue);

div.radio {
  flex-flow: row wrap;
  justify-content: center;
  padding: 5px;
  user-select: none;

  div.radio-wrap {
    height: 40px;
    padding: 5px 20px;
    border-bottom: 2px solid var(--w200);
    color: var(--w180);
    font-size: 18px;
    cursor: pointer;
    font-weight: bold;

    &:not(:first-child) {
      margin-left: 10px;
    }

    &.selected {
      color: var(--green);
      border-color: var(--green);
    }
  }
}
</style>
