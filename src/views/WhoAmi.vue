<template>
  <div class="whoami flex center w100">
    <div class="logo">
      <img src="~@images/vicflix.png" alt="logo_vicflix" height="35" />
    </div>
    <div class="profil-window flex column">
      <div class="title">Qui est-ce ?</div>
      <ul class="profil-list">
        <li
          class="profil flex column"
          v-for="profil of profilList"
          :key="profil.name"
          @click="connectUser(profil)"
        >
          <div class="avatar bg" :style="{ backgroundImage: `url(${profil.avatar})` }"></div>
          <span class="name ellipsis">{{ profil.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { IProfil } from '../models';
import { UserModule, profilList } from '../store';

@Component({})
export default class WhoAmI extends Vue {
  private profilList = profilList;

  connectUser(profil: IProfil) {
    UserModule.actions.connectUser(profil);
  }
}
</script>



<style lang="scss" scoped>
div.whoami {
  padding: 10px;
  background-color: $g20;

  div.logo {
    position: absolute;
    left: 30px;
    top: 20px;
  }

  div.profil-window {
    width: 650px;
    align-items: center;
    animation: bounce-in 0.4s;

    div.title {
      text-align: center;
      font-weight: bold;
      font-size: 45px;
      padding: 20px;
    }

    ul.profil-list {
      display: flex;
      width: 100%;
      justify-content: center;
      flex-flow: row wrap;

      li.profil {
        padding: 5px;
        margin: 10px;
        cursor: pointer;

        div.avatar {
          height: 110px;
          width: 110px;
          border: 3px solid $g40;
        }

        span.name {
          padding: 10px;
          text-align: center;
          font-size: 14px;
          color: $w130;
        }

        &:hover {
          div.avatar {
            border-color: $w230;
          }
          span.name {
            color: white;
          }
        }
      }
    }
  }
}
</style>
