<template>
  <Popin
    :width="200"
    :mode="popinMode"
    :debounce="true"
    in-header
    :arrow="true"
    :offset="4"
    :rounded="false"
    alignement="End"
  >
    <template #content>
      <div class="flex flex-col w-full text-sm">
        <div class="flex flex-col p-3">
          <button
            v-for="profile of profiles"
            :key="profile.id"
            type="button"
            class="User / group flex flex-row items-center py-2"
            @click="selectProfile(profile)"
          >
            <div class="Picture / relative w-8 h-8">
              <img
                :src="profile.picture"
                class="absolute top-0 left-0 object-cover w-full h-full rounded"
              />
            </div>
            <span class="Name / group-hover:underline ml-2 text-center text-white">{{
              profile.name
            }}</span>
          </button>
          <span class="py-1">Gérer les profils</span>
        </div>
        <div class="bg-w120 w-full h-px"></div>
        <div class="flex flex-col p-3">
          <span class="py-1">Compte</span>
          <span class="py-1">Centre d'aide</span>
          <button type="button" class="hover:underline py-1" @click="disconnect"
            >Se déconnecter</button
          >
        </div>
      </div>
    </template>
    <template #button>
      <button type="button" class="flex flex-row items-center">
        <div class="Picture / relative w-8 h-8">
          <img
            :src="picture"
            class="group-hover:ring-2 group-hover:ring-white absolute top-0 left-0 object-cover w-full h-full rounded"
          />
        </div>
        <SvgIcon src="popup/arrow_top" class="ml-2" :size="10" />
      </button>
    </template>
  </Popin>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';
import { AuthModule } from '@store';
import { BreakPointsTypes, BreakPointsValues, NavLink, routerPagesNames, User } from '@models';
import { Location } from 'vue-router';
import { usersConstant } from '@constants';
import { BreakpointMixin } from '@mixins';
import DarkModeButton from './DarkModeButton.vue';
import AutoDarkModeButton from './AutoDarkModeButton.vue';

@Component({
  components: { DarkModeButton, AutoDarkModeButton },
})
export default class UserPopup extends BreakpointMixin {
  get user() {
    return AuthModule.state.user!;
  }

  get popinMode() {
    if (this.windowWidth < BreakPointsValues.Small) {
      return 'click';
    } else {
      return 'hover';
    }
  }

  get picture() {
    return this.user.picture;
  }

  get profiles(): User[] {
    return usersConstant;
  }

  selectProfile(profile: User) {
    AuthModule.actions.connexionRequest(profile);
  }

  disconnect() {
    AuthModule.actions.disconnectUser();
  }
}
</script>

<style lang="postcss">
div.Button {
  flex: 0 0 auto;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
