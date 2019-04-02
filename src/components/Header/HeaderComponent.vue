<template>
  <div class="header-wrapper">
    <header>
      <NavBar />
      <div class="box-right flex">
        <Popup :outside="true" :width="200" mode="hover">
          <div class="user-popup" slot="popup"></div>
          <div class="user-button" slot="button">
            <div class="avatar bg" :style="userAvatar"></div>
            <SvgIcon src="icons/Forms/arrow_bottom" />
          </div>
        </Popup>
      </div>
    </header>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Popup } from '@components';
import { routesNames } from '@router';
import { Forms } from '@constructors';
import NavBar from './NavBar.vue';
import { UserModule } from '../../store';

@Component({
  components: { Popup, NavBar },
})
export default class HeaderComponent extends Vue {
  get userAvatar() {
    return { backgroundImage: `url(${UserModule.state.profil.avatar})` };
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

  div.logo {
    justify-content: flex-start;
    padding-left: 20px;
    align-items: center;
    img {
      width: 100px;
    }
  }

  div.box-right {
    flex: 1 0 auto;
    justify-content: flex-end;
    align-items: center;
    margin-right: 10px;

    div.user-popup {
      display: flex;
      flex-flow: column wrap;
      width: 100%;
      color: white;

      .option {
        font-weight: bold;
        padding: 15px 30px 15px 30px;
        cursor: pointer;

        &:not(:last-child) {
          border-bottom: 1px solid $g90;
        }

        &:hover {
          background-color: $g90;
        }
      }
    }

    div.user-button {
      flex: 0 0 auto;
      flex-flow: row nowrap;
      align-items: center;
      padding: 5px 10px 5px 10px;
      border-radius: 5px;
      cursor: pointer;
  }
}
</style>
