<template>
  <div class="header-wrapper">
    <header :class="{ transparent: headerFade }">
      <NavBar />
      <div class="box-right flex">
        <Popup :outside="true" :width="150" :mode="getPopupMode">
          <div class="user-popup flex column" slot="popup">
            <ul class="profils flex column">
              <li
                class="profil flex"
                v-for="profil of profilList"
                :key="profil.name"
                @click="connectUser(profil)"
              >
                <div class="avatar bg" :style="{ backgroundImage: `url(${profil.avatar})` }"></div>
                <span class="name">{{ profil.name }}</span>
              </li>
            </ul>
            <ul class="settings flex column">
              <span class="link">Compte</span>
              <span class="link">Centre d'aide</span>
              <router-link class="link" to="/">Se deconnecter</router-link>
            </ul>
          </div>
          <div class="user-button flex" slot="button">
            <div class="avatar bg" :style="userAvatar"></div>
            <SvgIcon src="icons/Forms/arrow_bottom.svg" color="white" />
          </div>
        </Popup>
      </div>
    </header>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Popup from '../Shared/Display/Popup.vue';
import { routesNames } from '@router';
import { Forms } from '@constructors';
import NavBar from './NavBar.vue';
import { UserModule, profilList, GlobalModule } from '../../store';
import { IProfil } from '../../models';
import { oc } from 'ts-optchain';

@Component({
  components: { Popup, NavBar },
})
export default class HeaderComponent extends Vue {
  get profilList() {
    return profilList.filter(f => f.name !== oc(UserModule).state.profil.name());
  }

  get userAvatar() {
    return { backgroundImage: `url(${oc(UserModule).state.profil.avatar()})` };
  }

  disconnect() {
    UserModule.actions.disconnectRequest();
  }

  connectUser(profil: IProfil) {
    UserModule.actions.connectUser(profil);
  }

  get getPopupMode() {
    return GlobalModule.state.mobile ? 'click' : 'hover';
  }

  private headerFade = false;

  scrollHandler() {
    if (window.scrollY > 0) {
      this.headerFade = false;
    } else {
      this.headerFade = true;
    }
  }
  created() {
    window.addEventListener('scroll', this.scrollHandler);
    this.scrollHandler();
  }
}
</script>



<style lang="scss" scoped>
header {
  position: fixed;
  display: flex;
  justify-content: flex-start;
  top: 0px;
  left: 0px;
  height: $headerHeight;
  background-color: black;
  width: 100%;
  z-index: 9000;
  flex-flow: row nowrap;
  transition: background-color 0.5s;

  &.transparent {
    background-color: rgba(0, 0, 0, 0);
    // box-shadow: 0 0 30px inset rgba(0, 0, 0, 0.4);
  }

  div.logo {
    justify-content: flex-start;
    padding-left: 20px;
    align-items: center;
    img {
      width: 100px;
    }
  }

  div.box-right {
    flex: 0 0 auto;
    justify-content: flex-end;
    align-items: center;
    margin-right: 30px;

    div.user-popup {
      width: 100%;
      ul.profils {
        padding: 10px 0 10px 0;
        border-bottom: 1px solid $g90;
        li.profil {
          flex-flow: row nowrap;
          align-items: center;
          padding: 5px;
          cursor: pointer;

          div.avatar {
            height: 30px;
            width: 30px;
            margin-right: 10px;
            margin-left: 5px;
          }

          span.name {
            font-size: 13px;
          }

          &:hover {
            span.name {
              text-decoration: underline;
            }
          }
        }
      }

      ul.settings {
        padding: 10px;

        .link {
          padding-bottom: 5px;
          font-size: 13px;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    div.user-button {
      flex: 0 0 auto;
      flex-flow: row nowrap;
      align-items: center;
      padding: 5px 10px 5px 10px;
      cursor: pointer;

      .avatar {
        height: 30px;
        width: 30px;
        margin-right: 10px;
      }
    }
  }
}
</style>
