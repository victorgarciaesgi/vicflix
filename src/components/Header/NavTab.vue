<template>
  <router-link
    :to="data.link"
    :exact="data.exact"
    class="link flex"
    :class="{ list, button: !list }"
  >
    <SvgIcon class="icon" v-if="data.icon" :src="data.icon" :size="20" :color="getColor" />
    <span>{{ data.label }}</span>
  </router-link>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { NavLink } from '@models';

@Component
export default class NavTab extends Vue {
  @Prop() data: NavLink;
  @Prop() list: boolean;

  get getColor() {
    let active = false;
    if (this.data.exact) {
      active = this.$route.path === this.data.link;
    } else {
      active = this.$route.matched.some(s => {
        return s.path === this.data.link;
      });
    }
    if (active) return 'text';
    else return 'white';
  }
}
</script>



<style lang="scss" scoped>
a.link {
  align-items: center;
  justify-content: center;
  color: $w240;
  height: 35px;
  padding: 8px 3px 8px 3px;
  margin: 0 10px 0 10px;
  font-size: 14px;
  flex: 0 0 auto;
  transition: opacity 0.3s;

  span {
    transition: transform 0.2s, font-weight 0.3s;
  }

  &:hover:not(.router-link-active) {
    opacity: 0.8;
  }

  .icon {
    margin-right: 5px;
  }

  &.button {
    &.router-link-active {
      span {
        transform: scale(1.1);
        color: white;
        font-weight: bold;
        cursor: default;
      }
    }
  }

  &.list {
    padding: 0;
    margin: 0;
    border-radius: 0;
    height: 40px;

    &:not(:last-child) {
      // border-bottom: 1px solid $w230;
    }
    &.router-link-active {
      font-weight: bold;
      color: $primary;
    }
  }
}
</style>
