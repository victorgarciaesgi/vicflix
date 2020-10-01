<template>
  <Popin :width="250" in-header alignement="End">
    <template #popup>
      <div class="flex flex-col w-full">
        <!-- <div class="border-bg4 bg-bg1 flex flex-col py-5 border-b">
          <div class="center flex">
            <div class="--Avatar-Mask w-16 h-16" round :style="userAvatar"></div>
          </div>
          <div class="mt-3 text-lg font-semibold text-center">{{ userName }}</div>
        </div> -->
        <div class="flex flex-col w-full !font-semibold">
          <div class="bg-bg3 w-full h-px mx-3"></div>
          <!-- <div class="flex flex-col px-3 py-3">
            <DarkModeButton />
          </div>
          <div class="flex flex-col px-3 py-3">
            <AutoDarkModeButton />
          </div> -->

          <!-- <div class="bg-bg3 w-full h-px"></div> -->

          <div class="text-redError hover:bg-bg2 px-3 py-3 cursor-pointer" @click="disconnect"
            >Se deconnecter</div
          >
        </div>
      </div>
    </template>
    <template #button="{ active }">
      <div :class="{ active }" class="Button / center py-4px flex flex-row px-4">
        <div class="flex flex-col mr-3">
          <span class="text-text2 text-md font-semibold">{{ userName }}</span>
        </div>
        <div class="center bg-bg5 flex w-10 h-10 text-lg font-bold uppercase rounded-full"> </div>
      </div>
    </template>
  </Popin>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';
import { AuthModule } from '@store';
import { NavLink, routerPagesNames } from '@models';
import { Popin } from '@components';
import { Location } from 'vue-router';
import DarkModeButton from './DarkModeButton.vue';
import AutoDarkModeButton from './AutoDarkModeButton.vue';

@Component({
  components: { DarkModeButton, AutoDarkModeButton, Popin },
})
export default class UserPopup extends Vue {
  get isLoggedIn() {
    return AuthModule.state.loggedIn;
  }
  get userName() {
    if (this.user) {
      return this.user.name;
    }
    return null;
  }

  get user() {
    return AuthModule.state.user!;
  }

  disconnect() {
    AuthModule.actions.disconnect();
  }
}
</script>

<style lang="postcss">
div.Button {
  flex: 0 0 auto;
  flex-flow: row nowrap;
  align-items: center;
  border-radius: 5px;
  justify-content: center;
  cursor: pointer;

  .arrow {
    transition: transform 0.3s;
    &.active {
      transform: rotate(-180deg);
    }
  }

  @mixin dark {
    &:hover,
    &.active {
      background-color: var(--bg4);
    }
  }
  @mixin light {
    &:hover,
    &.active {
      background-color: var(--bg3);
    }
  }
}
</style>
