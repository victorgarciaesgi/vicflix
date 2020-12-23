<template>
  <div class="Profile / bg-g20 flex-nowrap fixed left-0 right-0 flex flex-col w-screen h-screen">
    <div class="flex-0 flex flex-row px-8 py-4">
      <img src="@images/vicflix.png" width="90" />
    </div>
    <div class="flex flex-col items-center flex-1">
      <h1 class="py-3 font-normal">Qui est-ce ?</h1>
      <div class="flex flex-row items-center justify-center">
        <div v-for="profile of profiles" :key="profile.id" class="User / flex flex-col">
          <div class="Picture / relative rounded-sm">
            <img
              :src="require(profile.picture)"
              class="absolute top-0 left-0 object-cover w-full h-full"
            />
          </div>
          <span class="Name /">{{ profile.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { usersConstant } from '@constants';
import { User } from '@models';
import { Component, Vue, Prop } from 'nuxt-property-decorator';

@Component({})
export default class ProfileSelect extends Vue {
  get profiles(): User[] {
    return usersConstant;
  }
}
</script>

<style lang="postcss" scoped>
div.Profile {
  z-index: 20000;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  }

  div.User {
    div.Picture {
      height: 10vw;
      width: 10vw;
      max-height: 200px;
      max-width: 200px;
      min-height: 84px;
      min-width: 84px;
    }
    span.Name {
      font-size: 1.3vw;
    }
  }
}
</style>
